class TaskObserver < ActiveRecord::Observer
  include BackboneSync::Rails::Faye::Observer
end
