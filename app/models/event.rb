class Event < ApplicationRecord
  belongs_to :user
  has_many :rounds, dependent: :destroy
  has_many :participants, dependent: :destroy
end
