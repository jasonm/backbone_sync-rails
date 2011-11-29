require 'spec_helper'

describe BackboneSync::Rails::Faye::Observer do
  context 'Default model subchannel settings' do
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

  context 'Model that is set in a child relationship' do
    let(:task) { Factory(:task) }

    it 'broadcasts updates over a Faye channel' do
      comment = Factory(:comment, task: task, body: 'this body isn\'t too great')
      new_attributes = Factory.attributes_for(:comment, body: 'I like this body')
      comment.update_attributes(new_attributes)

      expected_attributes = JSON.parse(comment.to_json)

      FakeFayeServer.messages.should include({
        "channel" => "/sync/tasks/#{task.id}/comments",
        "data" => {
          "update" => {
            comment.id.to_s => expected_attributes
          }
        }
      })
    end

    it 'broadcasts destroys over a Faye channel' do
      comment = Factory(:comment, task: task)
      comment.destroy

      expected_attributes = JSON.parse(comment.to_json)

      FakeFayeServer.messages.should include({
        "channel" => "/sync/tasks/#{task.id}/comments",
        "data" => {
          "destroy" => {
            comment.id.to_s => expected_attributes
          }
        }
      })
    end

    it 'broadcasts creates over a Faye channel' do
      comment = Factory(:comment, task: task)
      expected_attributes = JSON.parse(comment.to_json)

      FakeFayeServer.messages.should include({
        "channel" => "/sync/tasks/#{task.id}/comments",
        "data" => {
          "create" => {
            comment.id.to_s => expected_attributes
          }
        }
      })
    end
  end
end
