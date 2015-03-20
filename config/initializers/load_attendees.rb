require 'csv'

attendees = {}
CSV.foreach("attendees.csv", encoding: "Windows-1252") do |row|
  attendees[row[5]] = {
    name:     (row[2] + row[3]).titleize,
    chapter:  row[8]
  }
end
p attendees.to_s

Rails.configuration.attendees = attendees
Rails.configuration.photos = "public/photos/"
Rails.configuration.endpoint = "http://ghost.eecs.berkeley.edu:4997/register"
