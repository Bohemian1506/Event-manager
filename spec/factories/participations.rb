FactoryBot.define do
  factory :participation do
    participant { nil }
    round { nil }
    is_joining { false }
    is_paid { false }
  end
end
