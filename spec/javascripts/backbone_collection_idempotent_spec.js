describe("Backbone.Collection.add", function() {
  it("won't insert duplicates if two models with the same id are inserted", function() {
    var collection = new Backbone.Collection();
    var model      = new Backbone.Model({id: 1});
    var modelCopy  = new Backbone.Model({id: 1});

    collection.add(model);
    collection.add(modelCopy);

    expect(collection.models.length).toEqual(1);
  });

  it("will accept a model without an id", function() {
    var collection = new Backbone.Collection();
    var modelWithoutId = new Backbone.Model({id: undefined});

    collection.add(modelWithoutId);
    expect(collection.models).toEqual([modelWithoutId]);
  });
});
