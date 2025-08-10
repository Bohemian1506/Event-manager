class Participation < ApplicationRecord
  belongs_to :participant
  belongs_to :round

  validates :is_joining, inclusion: { in: [true, false] }
  validates :is_paid, inclusion: { in: [true, false] }
end
