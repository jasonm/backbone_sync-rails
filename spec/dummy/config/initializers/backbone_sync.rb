ActiveRecord::Base.class_eval do

BackboneSync::Rails::Faye.root_address = {
  'test' => 'http://localhost:9293',
}[Rails.env]
end
