require 'net/http'
require 'json'

module BackboneSync
  module Rails
    module Faye
      # To publish from outside of an `EM.run {}` loop:
      # http://groups.google.com/group/faye-users/browse_thread/thread/ae6e2a1cc37b3b07
      class Message
        def initialize(channel, data)
          @channel = channel
          @data = data
        end

        def send
          Net::HTTP.post_form(uri, :message => payload) 
        end

        private

        def uri
          URI.parse("#{BackboneSync::Rails::Faye.root_address}/faye")
        end

        def payload
          {:channel => @channel, :data => @data}.to_json
        end
      end
    end
  end
end
