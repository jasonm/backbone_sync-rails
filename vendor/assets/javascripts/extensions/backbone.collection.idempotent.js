Backbone.Collection.prototype._addWithIdCheck = function(model, options) {
  if (model.id === undefined || this.get(model.id) === undefined) {
    this._addWithoutIdCheck(model, options);
  }
};

Backbone.Collection.prototype._addWithoutIdCheck = Backbone.Collection.prototype.add;
Backbone.Collection.prototype.add = Backbone.Collection.prototype._addWithIdCheck;