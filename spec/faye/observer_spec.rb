require 'spec_helper'

describe BackboneSync::Rails::Faye::Observer do
  it 'broadcasts updates over a Faye channel' do
    task = Factory(:task, title: 'Old Title')
    new_attributes = Factory.attributes_for(:task, title: 'New Title')
    task.update_attributes(new_attributes)

    expected_attributes = JSON.parse(task.to_json)

    FakeFayeServer.messages.should include({
      "channel" => "/sync/tasks",
      "data" => {
        "update" => {
          task.id.to_s => expected_attributes
        }
      }
    })
  end

  it 'broadcasts destroys over a Faye channel' do
    task = Factory(:task, title: 'Old Title')
    task.destroy

    expected_attributes = JSON.parse(task.to_json)

    FakeFayeServer.messages.should include({
      "channel" => "/sync/tasks",
      "data" => {
        "destroy" => {
          task.id.to_s => expected_attributes
        }
      }
    })
  end

  it 'broadcasts creates over a Faye channel' do
    task = Factory(:task)
    expected_attributes = JSON.parse(task.to_json)

    FakeFayeServer.messages.should include({
      "channel" => "/sync/tasks",
      "data" => {
        "create" => {
          task.id.to_s => expected_attributes
        }
      }
    })
  end
end
