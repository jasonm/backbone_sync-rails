this.BackboneSync = this.BackboneSync || {};

BackboneSync.FayeAuthorization = (function() {
  function FayeAuthorization(options) {
    this.authToken = options.auth_token;
  }

  FayeAuthorization.prototype.outgoing = function(message, callback) {
    if(!message['channel'] === '/meta/subscribe') {
      return callback(message);
    }

    if(!message['ext']) {
      message['ext'] = {}
    }

    message['ext']['authToken'] = this.authToken;

    return callback(message);
  };

  return FayeAuthorization;
})();
