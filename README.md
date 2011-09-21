# BackboneSyncRails

Use this in a Rails 3.1 app.  Right now the only supported pubsub messaging
system is Faye http://faye.jcoglan.com/.

## Installation

This assumes you already have a Backbone.js + Rails app.

0.  Install the gem, say in your `Gemfile`:

    ```ruby
    gem 'backbone_sync-rails', '~> 0.0.1'
    ```

1.  Run a Faye server.  It's pretty straightforward, check out `example_faye/run.sh` in this repo.

2.  Tell your app where the faye server is.  This may differ per Rails.env.
    For now, let's say we add `config/initializers/backbone_sync_rails_faye.rb` with:

    ```ruby
    BackboneSync::Rails::Faye.root_address = 'http://localhost:9292'
    ```

3.  Pull in the javascripts:

    ```javascript
    //= require extensions/backbone.collection.idempotent
    //= require backbone_sync-rails/rails_faye_subscriber
    ```

4.  Open a connection to Faye from your clients, somewhere on your page (in the layout?):

    ```eruby
    <script type="text/javascript" src="<%= BackboneSync::Rails::Faye.root_address %>/faye.js"></script>
    ```

5.  Observe model changes in Rails, and broadcast them.  The gem provides the guts of
    an observer for you, so add a file like `app/models/user_observer.rb`:

    ```ruby
    class UserObserver < ActiveRecord::Observer
      include BackboneSync::Rails::Faye::Observer
    end
    ```

    and enable it in `config/application.rb` like any good observer:

    ```ruby
    module MyApp
      class Application < Rails::Application
        # snip...

        # Activate observers that should always be running.
        config.active_record.observers = :user_observer

        # snip...
      end
    end
    ```

7.  Instantiate a new `BackboneSync.RailsFayeSynchronizer` for *each instance*
    of a Backbone collection you instantiate.  You could do this in the
    collection's constructor, or do it by hand:

    ```javascript
    // For simplicitly, here it is in a router, or app bootstrap
    this.users = new MyApp.Collections.UsersCollection();
    var fayeClient = new Faye.Client('<%= BackboneSync::Rails::Faye.root_address %>/faye');
    new BackboneSync.RailsFayeSubscriber(this.users, {
      channel: 'users', // Set to Rails model.class.table_name, or override Model#faye_channel
      client: fayeClient
    });
    this.wizards.reset(options.users);
    ```

8.  Check it out!  Open two browsers, do some stuff in one, and see your changes
    cascade to the other.  Your Backbone views will need to observe events on
    the collection like `change`, `add`, and `remove`.

### Installing on Rails < 3.1

If you're on a version of Rails < 3.1, you'll probably have to copy some files
into your app by hand, like the `vendor/assets` files.  You'll probably have to
require the `lib/backbone_sync-rails/faye.rb` file yourself, too.

## Example app

I wrote an untested example application that uses CoffeeScript and the
backbone-rails generators:

https://github.com/jasonm/wizards

## Caveats

In short, I augment the `Backbone.Collection.prototype._add` function so
that adding multiple models to the same collection with the same `id` attribute
(or your `idAttribute`-specified attribute of choice) will pass silently.

In long:

In a distributed messaging system, messages should be idempotent: this means
that, for any message, an actor should be able to execute that message several
times with no ill effect.

Why?  Consider the following situation.

1. There are two clients, Alice and Bob.
2. Alice creates a new model in Backbone.
3. The server receives her request and persists it.  It also distributes a
"create" message to all subscribed clients.  4. Alice's new model is added to
her local collection in the normal due course of
`Backbone.Model.prototype.save`.
5. Bob receives the create message and creates a model in his local collection.
6. All is well until this point.  Now, Alice receives the create message (she
is subscribed just as Bob is) and creates a duplicate model into her
collection.

There is actually a race condition in that Alice's HTTP request to create (and
therefore her normal `save()`-based addition to the collection)_ may complete
before or after the pubsub notification informs her collection to add a new
member.

One approach to solving this would be for each update message to be tagged with
its originating client, and for each client to filter out those messages.  This
would prove difficult, particularly since, in this implementation, the
`ActiveModel::Observer` subclass is decoupled from the originating client.

The change made in
`vendor/assets/javascripts/extensions/backbone.collection.idempotent.js` is to
make `Backbone.Collection.prototype.add` idempotent with respect to the
server-side `id` attribute, and neatly addresses the issue.

I'm more than happy to hear about better approaches from people with more
experience in distributed messaging systems.

## Copyright

Copyright (c) 2011 Jason Morrison. See MIT-LICENSE for details.
