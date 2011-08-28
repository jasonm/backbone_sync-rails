require 'backbone_sync-rails/faye/message'

module BackboneSync
  module Rails
    module Faye
      class Event
        def initialize(model, event)
          @model = model
          @event = event
        end

        def broadcast
          Message.new(channel, data).send
        end

        private

        def channel
          "/sync/#{@model.class.table_name}"
        end

        def data
          { @event => { @model.id => @model.as_json } }
        end
      end
    end
  end
end
