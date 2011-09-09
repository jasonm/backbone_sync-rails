Backbone.Collection.prototype._addWithIdCheck = function(model, options) {
  var idAttribute = model.idAttribute || this.model.prototype.idAttribute;
  var modelId = model[idAttribute];

  if (modelId === undefined || this.get(modelId) === undefined) {
    this._addWithoutIdCheck(model, options);
  }
};

Backbone.Collection.prototype._addWithoutIdCheck = Backbone.Collection.prototype._add;
Backbone.Collection.prototype._add = Backbone.Collection.prototype._addWithIdCheck;
