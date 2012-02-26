$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "backbone_sync-rails/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "backbone_sync-rails"
  s.version     = BackboneSyncRails::VERSION
  s.authors     = ["Jason Morrison"]
  s.email       = ["jason.p.morrison@gmail.com"]
  s.homepage    = "http://github.com/jasonm/backbone_sync-rails"
  s.summary     = "Effortlessly keep Backbone.js clients in sync."
  s.description = "Broadcast changes from Rails models to client-side Backbone.js collections with WebSockets."

  s.files = Dir["{app,config,db,lib,vendor}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.md"]
  s.test_files = Dir["spec/**/*"]

  s.add_dependency "rails", ">= 3.0.0"

  s.add_development_dependency "sqlite3"
  s.add_development_dependency "rspec-rails"
  s.add_development_dependency "factory_girl_rails"
  s.add_development_dependency "sham_rack"
  s.add_development_dependency "jasmine"
end
