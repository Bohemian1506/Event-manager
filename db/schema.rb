# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_08_10_195348) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "events", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "share_token"
    t.index ["share_token"], name: "index_events_on_share_token"
    t.index ["user_id"], name: "index_events_on_user_id"
  end

  create_table "participants", force: :cascade do |t|
    t.bigint "event_id", null: false
    t.string "name"
    t.string "email"
    t.string "edit_token"
    t.datetime "expires_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["edit_token"], name: "index_participants_on_edit_token"
    t.index ["event_id"], name: "index_participants_on_event_id"
  end

  create_table "participations", force: :cascade do |t|
    t.bigint "participant_id", null: false
    t.bigint "round_id", null: false
    t.boolean "is_joining"
    t.boolean "is_paid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["participant_id"], name: "index_participations_on_participant_id"
    t.index ["round_id"], name: "index_participations_on_round_id"
  end

  create_table "rounds", force: :cascade do |t|
    t.bigint "event_id", null: false
    t.string "name"
    t.integer "order"
    t.string "venue"
    t.time "start_time"
    t.integer "fee"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_rounds_on_event_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email_address", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
  end

  add_foreign_key "events", "users"
  add_foreign_key "participants", "events"
  add_foreign_key "participations", "participants"
  add_foreign_key "participations", "rounds"
  add_foreign_key "rounds", "events"
  add_foreign_key "sessions", "users"
end
