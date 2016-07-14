document.addEventListener('DOMContentLoaded', myFunction)

function myFunction() {
  var form_element = document.getElementById('form1');
  var form_value = form_element.elements[0].value;
  searchURL(form_value);
}

function searchURL(value) {
  var searchUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="+ value+"&key=AIzaSyDDNGnZS3lFLPw1DLC_5gAT5F_9hga1c-k";
  search(searchUrl);
  return searchUrl;
}

function search(locURL) {
  $.ajax({
    url: locURL,
    method: "GET",
    dataType: 'json',
    success : function (data) {
      var obj = data;
      var o = obj.results[0]["geometry"]["location"];
      // console.log(o.lat);console.log(o.lng);
      makeURL(o.lat, o.lng);
      initialize(o.lat, o.lng);
    }
  })
}

function makeURL(lat, lng) {
  var url = "https://maps.googleapis.com/maps/api/timezone/json?location="+ lat + "," + lng + "&timestamp=1331161200&key=AIzaSyDDzmZaROsHfgXjz6hv4JuBs0eGcvh3HBI";
  timezn(url);
  return url;
}

function timezn(tzURL) {
  $.ajax({
    url: tzURL,
    method: "GET",
    dataType: 'json',
    success : function (data) {
      var obj = data;
      var tz = obj.timeZoneId;
      console.log(tz);
      document.getElementById('tz').innerHTML=tz;
      // newCityTz(tz);
    }
  })
}

function newCityTz() {
  var value = document.getElementById('tz').innerHTML;
  var time = moment()
  var newCity = time.clone().tz(value);
  var converted = newCity.format('MMMM Do YYYY, h:mm:ss a');
  document.getElementById('converted').innerHTML = "Local time: " + converted;
}

function updateClock(){
  var now = moment();
  var nz = now.format('MMMM Do YYYY, h:mm:ss a');
  document.getElementById('time').innerHTML = "NZ time: " + nz;
}

function timedUpdate () {
  updateClock();
  newCityTz();
  setTimeout(timedUpdate, 1000);
}

timedUpdate();

function initialize(lat, lng) {
  var mapOptions = {
    // center: new google.maps.LatLng(-36.7700338,174.7002408),
    center: new google.maps.LatLng(lat,lng),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  new google.maps.Map(document.getElementById('map'), mapOptions);
}
// google.maps.event.addDomListener(window, 'load', initialize);
