class BackboneSyncObserver < ActiveRecord::Observer
  observe :task, :comment
  include BackboneSync::Rails::Faye::Observer
end
