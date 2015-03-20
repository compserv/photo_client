require "uri"
require "net/http"

class ClientController < ApplicationController

  def index
  end

  def autocomplete
    prefix = params["prefix"]
    autocompletes = Rails.configuration.attendees.reject do |key, value|
      !(value[:name] =~ /#{prefix}/)
    end
    result = []
    autocompletes.each do |key, value|
      result << { email: key, name: value[:name], chapter: value[:chapter] }
    end
    render json: result
  end

  def get_latest_photo
    ts = params["t"].to_i
    p = Dir[Rails.configuration.photos + '*'].reject do |f|
      File.mtime(f).to_i < ts
    end.sort_by do |f| 
      File.mtime(f)
    end.last
    render plain: "" and return if p.nil?
    render plain: p.gsub("public/", "")
  end

  def send_request
    email    = params["email"]
    filename = params["filename"]

    send_params = {
      "email"     => email,
      "filename"  => filename
    }

    x = Net::HTTP.post_form(URI.parse(Rails.configuration.endpoint),
        send_params)

    render plain: x.body
  end
end
