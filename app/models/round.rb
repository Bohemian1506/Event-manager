class Round < ApplicationRecord
  belongs_to :event
  has_many :participations, dependent: :destroy
end
