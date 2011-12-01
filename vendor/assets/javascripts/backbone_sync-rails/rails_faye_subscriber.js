this.BackboneSync = this.BackboneSync || {};

BackboneSync.RailsFayeSubscriber = (function() {
  function RailsFayeSubscriber(collection, options) {
    this.collection = collection;
    this.client = options.client;
    this.channel = options.channel;
    this.useAuthorization = options.use_authorization;
    this.authToken = options.auth_token;

    if (this.useAuthorization === true) {
      outgoingAuth = new BackboneSync.FayeAuthorization({ auth_token: options.auth_token });
      this.client.addExtension(outgoingAuth);
    }

    this.subscription = this.subscribe();
  }

  RailsFayeSubscriber.prototype.subscribe = function() {
    return this.client.subscribe("/sync/" + this.channel, _.bind(this.receive, this));
  };

  RailsFayeSubscriber.prototype.receive = function(message) {
    var self = this;
    return $.each(message, function(event, eventArguments) {
      return self[event](eventArguments);
    });
  };

  RailsFayeSubscriber.prototype.update = function(params) {
    var self = this;
    return $.each(params, function(id, attributes) {
      var model = self.collection.get(id);
      return model.set(attributes);
    });
  };

  RailsFayeSubscriber.prototype.create = function(params) {
    var self = this;
    return $.each(params, function(id, attributes) {
      var model = new self.collection.model(attributes);
      return self.collection.add(model);
    });
  };

  RailsFayeSubscriber.prototype.destroy = function(params) {
    var self = this;
    return $.each(params, function(id, attributes) {
      var model = self.collection.get(id);
      return self.collection.remove(model);
    });
  };

  RailsFayeSubscriber.prototype.leave = function() {
    this.subscription.cancel();
    return true;
  };

  return RailsFayeSubscriber;
})();
