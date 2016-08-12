document.addEventListener('DOMContentLoaded', myFunction);

// get user input from form
function myFunction() {
  var form_element = document.getElementById('form1');
  var form_value = form_element.elements[0].value;
  searchURL(form_value);
}

// submit user input to google API to determine geo location codes
function searchURL(value) {
  var searchUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="+ value+"&key=AIzaSyDDNGnZS3lFLPw1DLC_5gAT5F_9hga1c-k";
  search(searchUrl);
  return searchUrl;
}

// interptret API response and extract latitude & longitude
function search(locURL) {
  $.ajax({
    url: locURL,
    method: "GET",
    dataType: 'json',
    success : function (data) {
      var obj = data;
      var o = obj.results[0]["geometry"]["location"];
      makeURL(o.lat, o.lng);
      initialize(o.lat, o.lng);
    }
  })
}

// construct URL to submit to google API to request time zone applicable in city
function makeURL(lat, lng) {
  var url = "https://maps.googleapis.com/maps/api/timezone/json?location="+ lat + "," + lng + "&timestamp=1331161200&key=AIzaSyDDzmZaROsHfgXjz6hv4JuBs0eGcvh3HBI";
  timezn(url);
  return url;
}

// interpret and extract time zone from API response
// Also print timezone to screen to help user
function timezn(tzURL) {
  $.ajax({
    url: tzURL,
    method: "GET",
    dataType: 'json',
    success : function (data) {
      var obj = data;
      var tz = obj.timeZoneId;
      document.getElementById('tz').innerHTML=tz;
    }
  })
}

// use time zone information to calculate (and display) local time in city
function newCityTz() {
  var value = document.getElementById('tz').innerHTML;
  var time = moment()
  var newCity = time.clone().tz(value);
  var converted = newCity.format('MMMM Do YYYY, h:mm:ss a');
  document.getElementById('converted').innerHTML = "Converted time: " + converted;
}

// find and display Local time
function updateLocalClock(){
  var now = moment();
  var nz = now.format('MMMM Do YYYY, h:mm:ss a');
  document.getElementById('time').innerHTML = "Local time: " + nz;
}

// Update local and new city clocks
function timedUpdate () {
  updateLocalClock();
  newCityTz();
  setTimeout(timedUpdate, 1000);
}

timedUpdate();

// load map
function initialize(lat, lng) {
  var mapOptions = {
    center: new google.maps.LatLng(lat,lng),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  new google.maps.Map(document.getElementById('map'), mapOptions);
}
