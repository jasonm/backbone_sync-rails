module BackboneSync
  module Rails
    module Pusher
      class Event
        def initialize(model, event)
          @model = model
          @event = event
        end

        def broadcast
          ::Pusher[channel].trigger! @event, data
        end

        private

        def channel
          subchannel = @model.class.table_name
          "sync-#{subchannel}"
        end

        def data
          { @model.id => @model.as_json }
        end
      end
    end
  end
end
