class Round < ApplicationRecord
  belongs_to :event
  has_many :participations, dependent: :destroy

  validates :name, presence: true
  validates :order, presence: true, uniqueness: { scope: :event_id }
end
