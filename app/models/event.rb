class Event < ApplicationRecord
  belongs_to :user
  has_many :rounds, dependent: :destroy
  has_many :participants, dependent: :destroy

  validates :name, presence: true
  validates :date, presence: true
end
