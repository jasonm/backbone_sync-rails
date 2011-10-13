require 'backbone_sync-rails/faye'
require 'backbone_sync-rails/pusher'

module BackboneSync
  module Rails
    NET_HTTP_EXCEPTIONS = [Timeout::Error, Errno::ETIMEDOUT, Errno::EINVAL,
                           Errno::ECONNRESET, Errno::ECONNREFUSED, EOFError,
                           Net::HTTPBadResponse, Net::HTTPHeaderSyntaxError,
                           Net::ProtocolError]

    class Engine < ::Rails::Engine
    end
  end
end
