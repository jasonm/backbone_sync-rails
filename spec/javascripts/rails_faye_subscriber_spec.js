describe("BackboneSync.RailsFayeSubscriber", function() {
  var client, collection, model, subscriber, auth_subscriber, Model;

  beforeEach(function() {
    model = {
      set: sinon.spy()
    };

    Model = sinon.stub().returns(model);

    collection = {
      model: Model,

      get: function() {
        return model;
      },

      remove: function(model) {
      },

      add: function(model) {
      }
    };

    sinon.spy(collection, 'add');
    sinon.spy(collection, 'get');
    sinon.spy(collection, 'remove');

    client = {
      subscribe: sinon.spy()
    };

    auth_client = {
      subscribe: sinon.stub().returns({
        channel:      "/meta/subscribe",
        successful:   true,
        clientId:     "fakeid",
        subscription: "/sync/comments",
        ext: { authToken: '1234abcd' }
      }),
      addExtension: sinon.spy()
    };

    failed_auth_client = {
      subscribe: sinon.stub().returns({
        channel:      "/meta/subscribe",
        successful:   false,
        clientId:     "fakeid",
        subscription: "/sync/authors",
        ext: { authToken: '1234abcd' },
        error: "Invalid subscription auth token"
      }),
      addExtension: sinon.spy()
    };

    subscriber = new BackboneSync.RailsFayeSubscriber(collection, {
      client: client,
      channel: "tasks"
    });

    auth_subscriber = new BackboneSync.RailsFayeSubscriber(collection, {
      client:            auth_client,
      channel:           "comments",
      use_authorization: true,
      auth_token:        "1234abcd"
    });

    failed_auth_subscriber = new BackboneSync.RailsFayeSubscriber(collection, {
      client:            failed_auth_client,
      channel:           "authors",
      use_authorization: true,
      auth_token:        "1234abcd"
    });
  });

  it("subscribes to a client on a channel", function() {
    expect(client.subscribe).toHaveBeenCalledWith("/sync/tasks");
    expect(typeof client.subscribe.getCall(0).args[1]).toEqual('function');
  });

  describe("Successful Authorization", function() {
    it("subscribes to an authorized client on a channel", function() {
      expect(auth_client.subscribe).toHaveBeenCalledWith("/sync/comments");
      expect(typeof auth_client.subscribe.getCall(0).args[1]).toEqual('function');
    });

    it("adds outgoing authentication when specified", function() {
      expect(auth_client.addExtension).toHaveBeenCalled();
    });

    it("adds outgoing authentication before subscription", function() {
      expect(auth_client.addExtension).toHaveBeenCalledBefore(auth_client.subscribe);
    });

    it("returns the authentication token sent on subscription", function() {
      expect(auth_client.subscribe.returnValues[0].ext.authToken).toEqual('1234abcd');
    });
  });

  describe("Failed Authorization", function() {
    it("subscribes to an authorized client on a channel", function() {
      expect(failed_auth_client.subscribe).toHaveBeenCalledWith("/sync/authors");
      expect(typeof failed_auth_client.subscribe.getCall(0).args[1]).toEqual('function');
    });

    it("adds outgoing authentication when specified", function() {
      expect(failed_auth_client.addExtension).toHaveBeenCalled();
    });

    it("adds outgoing authentication before subscription", function() {
      expect(failed_auth_client.addExtension).toHaveBeenCalledBefore(failed_auth_client.subscribe);
    });

    it("returns the authentication token sent on subscription", function() {
      expect(failed_auth_client.subscribe.returnValues[0].ext.authToken).toEqual('1234abcd');
    });

    it("returns an error message on unsuccesful authorization.", function() {
      expect(failed_auth_client.subscribe.returnValues[0].error).toEqual('Invalid subscription auth token');
    });
  });

  it("updates a model in a collection when an 'update' message is received", function() {
    subscriber.receive({
      'update': {
        '12345': {
          'title': 'New Title'
        }
      }
    });

    expect(collection.get).toHaveBeenCalledWith('12345');
    expect(model.set).toHaveBeenCalledWith({'title': 'New Title'});
  });

  it("removes a model from a collection when a 'destroy' message is received", function() {
    subscriber.receive({
      'destroy': {
        '12345': {}
      }
    });

    expect(collection.get).toHaveBeenCalledWith('12345');
    expect(collection.remove).toHaveBeenCalledWith(model);
  });

  it("adds a model to a collection when a 'create' message is received", function() {
    subscriber.receive({
      'create': {
        'id-does-not-matter': {'title': 'New Title'}
      }
    });

    expect(Model).toHaveBeenCalledWith({'title': 'New Title'});
    expect(collection.add).toHaveBeenCalledWith(model);
  });

  it("adds multiple models when a 'create' message is received with multiple object hashes", function() {
    subscriber.receive({
      'create': {
        'id-does-not-matter':   {'title': 'First'},
        'another-id-goes-here': {'title': 'Second'}
      }
    });

    expect(Model).toHaveBeenCalledWith({'title': 'First'});
    expect(Model).toHaveBeenCalledWith({'title': 'Second'});
    expect(collection.add).toHaveBeenCalledTwice();
  });

  it("handles multiple messages in the same payload", function() {
    subscriber.receive({
      'create':  { '1': {} },
      'destroy': { '2': {} }
    });

    expect(collection.add).toHaveBeenCalled();
    expect(collection.remove).toHaveBeenCalled();
  });
});
