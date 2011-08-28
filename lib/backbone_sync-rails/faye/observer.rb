require 'backbone_sync-rails/faye/event'

module BackboneSync
  module Rails
    module Faye
      module Observer
        def after_update(model)
          Event.new(model, :update).broadcast
        end

        def after_create(model)
          Event.new(model, :create).broadcast
        end

        def after_destroy(model)
          Event.new(model, :destroy).broadcast
        end
      end
    end
  end
end
