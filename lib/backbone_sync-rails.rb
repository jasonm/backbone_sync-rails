require "backbone_sync-rails/engine"
require 'backbone_sync-rails/faye'

module BackboneSync
  module Rails
    NET_HTTP_EXCEPTIONS = [Timeout::Error, Errno::ETIMEDOUT, Errno::EINVAL,
                           Errno::ECONNRESET, Errno::ECONNREFUSED, EOFError,
                           Net::HTTPBadResponse, Net::HTTPHeaderSyntaxError,
                           Net::ProtocolError]
  end
end
