class Participation < ApplicationRecord
  belongs_to :participant
  belongs_to :round
end
