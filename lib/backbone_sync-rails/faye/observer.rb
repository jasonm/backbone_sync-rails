require 'backbone_sync-rails/faye/event'

module BackboneSync
  module Rails
    module Faye
      module Observer
        def after_update(model)
          Event.new(model, :update, subchannel).broadcast
        rescue *NET_HTTP_EXCEPTIONS => e
          handle_net_http_exception(e)
        end

        def after_create(model)
          Event.new(model, :create, subchannel).broadcast
        rescue *NET_HTTP_EXCEPTIONS => e
          handle_net_http_exception(e)
        end

        def after_destroy(model)
          Event.new(model, :destroy, subchannel).broadcast
        rescue *NET_HTTP_EXCEPTIONS => e
          handle_net_http_exception(e)
        end

        def after_touch(model)
          Event.new(model, :update, subchannel).broadcast
        rescue *NET_HTTP_EXCEPTIONS => e
          handle_net_http_exception(e)
        end

        def handle_net_http_exception(exception)
          ::Rails.logger.error("")
          ::Rails.logger.error("Backbone::Sync::Rails::Faye::Observer encountered an exception:")
          ::Rails.logger.error(exception.class.name)
          ::Rails.logger.error(exception.message)
          ::Rails.logger.error(exception.backtrace.join("\n"))
          ::Rails.logger.error("")
        end

        def subchannel
          nil
        end
      end
    end
  end
end
