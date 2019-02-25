import * as $ from 'jquery';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css'; 
import * as d3 from 'd3';
import './style.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiamlubG9uZyIsImEiOiJhMWUzNzk1MTEyNTUyNzkyNzBjZWUzYWMwODM2ZjgyZiJ9.youixT7oBlwLEwXC9q3P3w';

// set up a mapbox map
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [-118.6167, 34.1737],
	zoom: 12
});

var dataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMA_kwqeopt52Kgsq77zsSdU_ZVduMTWPSLEBilPDijVZ48-HkdGbkVbJd4YWF8ujwdsE4i6XmyRMh/pub?gid=0&single=true&output=tsv'

d3.tsv(dataUrl).then(function(data) {
  data.forEach(function(d) {
    var el = document.createElement('div');
    el.className = 'marker';
    
    //add data to marker
    Object.getOwnPropertyNames(d).forEach(function(p) {
      el.setAttribute('data-' + p, d[p])
    });
    
    new mapboxgl.Marker(el)
      .setLngLat([parseFloat(d.lon), parseFloat(d.lat)])
      .addTo(map);
  });
});



// geocoder(data[0]['address'], mapboxgl.accessToken);
// function geocoder(address, accessToken) {
//   $.ajax({
//     url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=' + accessToken,
//     type: 'GET'
//   }).done(function(res) {
//     console.log(res['features'][0]['center']);
//   })
// }