describe("BackboneSync.RailsFayeSubscriber", function() {
  var client, collection, model, subscriber, Model;

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

    subscriber = new BackboneSync.RailsFayeSubscriber(collection, {
      client: client,
      channel: "tasks"
    });
  });

  it("subscribes to a client on a channel", function() {
    expect(client.subscribe).toHaveBeenCalled();
    expect(client.subscribe.getCall(0).args[0]).toEqual("/sync/tasks");
    expect(typeof client.subscribe.getCall(0).args[1]).toEqual('function');
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
