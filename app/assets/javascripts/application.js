// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

var Registration = {

  init: function() {
    $(".name").keyup(function() {
      var count = $(".name").val().length;
      if (count > 0) {
        Registration.load_autocomplete();
      }
    });
    $(".submit").click(function() {
      if ($(".submit").hasClass("success")) {
        // submit shit
        data = {
          email: Registration.email,
          filename: Registration.filename,
        }
        $.post('send_registration/', data, function(data) {
          Registration.reset_submit();
          Registration.reset_autocomplete();
          Registration.reset_photo();
          $(".name").val("");
          Registration.reset = true;
          Registration.email = "";
          Registration.filename = "";
        });
      }
      return false;
    });
  },

  load_autocomplete: function() {
    Registration.reset_autocomplete();
    Registration.reset_photo();
    Registration.reset = true;
    Registration.reset_submit();
    var text = $(".name").val();
    $.get("names/" + text, function(data) {
      data.forEach(function(item) {
        $(".autocomplete").append('<li><a href="#" data-email="' + item.email +
          '" data-name="' + item.name + '">' + item.name + ' <span>' +
          item.chapter + '</span></a></li>');
      });
      $(".autocomplete a").click(function() {
        $(".name").val($(this).attr("data-name"));
        Registration.email = $(this).attr("data-email");
        $(".name").addClass("success");
        $(".autocomplete").empty();
        Registration.selection_time = Math.floor(Date.now()/1000);
        Registration.last_timeout = setTimeout(Registration.get_photo, 50);
        Registration.reset = false;
        return false;
      });
    });
  },

  get_photo: function() {
    $.get("latest_photo?t=" + Registration.selection_time, function(data) {
      if (data != "") {
        $(".photo").css("background-image", "url('" + data + "')");
        $(".submit").addClass("success");
      }
      if (Registration.reset == false) {
        Registration.filename = data;
        Registration.last_timeout = setTimeout(Registration.get_photo, 50);
      }
      else {
        Registration.reset = false;
        Registration.reset_submit();
        $(".autocomplete").empty();
        Registration.reset_photo();
      }
    });
  },

  reset_photo: function() {
    $(".photo").css("background-image", "none");
  },

  reset_autocomplete: function() {
    $(".name").removeClass("success");
    $(".autocomplete").empty();
  },

  reset_submit: function() {
    $(".submit").removeClass("success");
  },

  reset: false,
  selection_time: Math.floor(Date.now()/1000),
  last_timeout: -1,
  email: "",
  filename: "",
}

$(document).ready(Registration.init);
