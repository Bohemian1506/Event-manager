class Participant < ApplicationRecord
  belongs_to :event
  has_many :participations, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :edit_token, presence: true, uniqueness: true
end
