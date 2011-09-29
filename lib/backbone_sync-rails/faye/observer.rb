require 'backbone_sync-rails/faye/event'

module BackboneSync
  module Rails
    module Faye
      module Observer
        def after_update(model)
          begin
            Event.new(model, :update).broadcast
          rescue *NET_HTTP_EXCEPTIONS => e
            handle_net_http_exception(e)
          end
        end

        def after_create(model)
          begin
            Event.new(model, :create).broadcast
          rescue *NET_HTTP_EXCEPTIONS => e
            handle_net_http_exception(e)
          end
        end

        def after_destroy(model)
          begin
            Event.new(model, :destroy).broadcast
          rescue *NET_HTTP_EXCEPTIONS => e
            handle_net_http_exception(e)
          end
        end

        def handle_net_http_exception(exception)
          ::Rails.logger.error("")
          ::Rails.logger.error("Backbone::Sync::Rails::Faye::Observer encountered an exception:")
          ::Rails.logger.error(exception.class.name)
          ::Rails.logger.error(exception.message)
          ::Rails.logger.error(exception.backtrace.join("\n"))
          ::Rails.logger.error("")
        end
      end
    end
  end
end
