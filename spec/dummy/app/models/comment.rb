class Comment < ActiveRecord::Base
  belongs_to :task

  def faye_channel
    "tasks/#{task.id}/comments"
  end
end
