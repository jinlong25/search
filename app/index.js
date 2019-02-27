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
	
	//add clickable actions
	d3.selectAll('.marker').on('click', function() {
		//unhighlight all markers
		d3.selectAll('.marker').style('background-color', 'transparent');
		
		//show info_pane
		d3.select('#info_pane').style('display', 'block')
		
		//update info_pane
		var thisProperty = d3.select(this);
		
		//highlight this marker
		thisProperty.style('background-color', '#ccc');
		
		d3.select('.property-thumbnail').attr('src', thisProperty.attr('data-thumbnail'));
		d3.select('.property-address').html(
			thisProperty.attr('data-street')
			 + ', ' 
			 + thisProperty.attr('data-city')
			 + ' '
			 + thisProperty.attr('data-zipcode')
		);
		d3.select('.zillow-link').attr('href', thisProperty.attr('data-homedetailslinks'));
		d3.select('.asking-price').html(thisProperty.attr('data-askingprice'));
		d3.select('.bedroom-count').html(thisProperty.attr('data-bedrooms'));
		d3.select('.bathroom-count').html(thisProperty.attr('data-bathrooms'));
		d3.select('.finished-sqft').html(thisProperty.attr('data-finishedsqft'));
		d3.select('.lot-sqft').html(thisProperty.attr('data-lotsizesqft'));
		
		//remove previous isochrone layers
		map.removeLayer('isomap0');
		map.removeLayer('isomap1');
		map.removeLayer('isomap2');
		//add isochrone layer
		var isochromeUrl = 'https://api.mapbox.com/isochrone/v1/mapbox/driving/'
			+ thisProperty.attr('data-lon') + ',' + thisProperty.attr('data-lat') +'?contours_minutes=3,5,10&contours_colors=6706ce,04e813,4286f4&polygons=true&access_token=' + mapboxgl.accessToken;
			
		//draw isochrone layer
		d3.json(isochromeUrl)
			.then(function(res) {
				res['features'].forEach(function(polygon, i) {
					map.addLayer( {
						'id': 'isomap' + i,
						'type': 'fill',
						'layout': {},
						'paint': {
							'fill-color': isocolor[i],
							'fill-opacity': 0.6
						},
						'source': {
							'type': 'geojson',
							'data': polygon
						}
					});
				});
			});
	});
});

var isocolor = ['#b2e2e2', '#66c2a4', '#238b45'];





// geocoder(data[0]['address'], mapboxgl.accessToken);
// function geocoder(address, accessToken) {
//   $.ajax({
//     url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=' + accessToken,
//     type: 'GET'
//   }).done(function(res) {
//     console.log(res['features'][0]['center']);
//   })
// }