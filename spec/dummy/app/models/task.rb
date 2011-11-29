class Task < ActiveRecord::Base
  has_many :comments
end
