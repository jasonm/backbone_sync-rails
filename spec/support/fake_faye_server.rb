class FakeFayeServer
  cattr_reader :messages

  def self.reset
    @@messages = []
  end

  def self.call(env)
    request = Rack::Request.new(env)
    query   = Rack::Utils.parse_query(request.body.read)
    message = JSON.parse(query["message"])

    @@messages.push(message)

    [200, {}, ["OK"]]
  end
end
