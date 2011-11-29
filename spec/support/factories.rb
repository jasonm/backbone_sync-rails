FactoryGirl.define do
  factory :task do
    title "An entirely relevent task"
    completed false
  end

  factory :comment do
    body "This body is hot."
    association :task
  end
end
