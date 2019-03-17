import * as $ from 'jquery';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css'; 
import * as d3 from 'd3';
import './style.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiamlubG9uZyIsImEiOiJhMWUzNzk1MTEyNTUyNzkyNzBjZWUzYWMwODM2ZjgyZiJ9.youixT7oBlwLEwXC9q3P3w';
var mapLayers = [];

// set up a mapbox map
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [-118.6167, 34.1737],
	zoom: 12
});

//draw highway buffer area
map.on('load', function() {
	d3.json('/data/fwy_101_buffer_1500ft.geojson')
		.then(function(res) {
			map.addLayer( {
				'id': 'highway_buffer',
				'type': 'fill',
				'layout': {},
				'paint': {
					'fill-color': '#C2C8CC',
					'fill-opacity': 0.6
				},
				'source': {
					'type': 'geojson',
					'data': res
				}
			});
		});
});

var dataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMA_kwqeopt52Kgsq77zsSdU_ZVduMTWPSLEBilPDijVZ48-HkdGbkVbJd4YWF8ujwdsE4i6XmyRMh/pub?gid=0&single=true&output=tsv'

d3.tsv(dataUrl).then(function(data) {	
  data.forEach(function(d) {
    var el = document.createElement('div');
    el.className = 'marker';
    
    //add data to marker
    Object.getOwnPropertyNames(d).forEach(function(p) {
      el.setAttribute('data-' + p, d[p]);
    });
		
		//initialize clicked state for each marker
		el.setAttribute('data-clicked', 0);
    
		//add markers to map
    new mapboxgl.Marker(el)
      .setLngLat([parseFloat(d.lon), parseFloat(d.lat)])
      .addTo(map);
  });
	
	//add clickable actions
	d3.selectAll('.marker').on('click', function() {
		
		//update info_pane
		var thisListing = d3.select(this);
			
		//unhighlight all markers
		d3.selectAll('.marker').style('background-color', 'transparent');
		
		//show info_pane
		d3.select('#info_pane').style('display', 'block');
		
		//highlight this marker
		thisListing.style('background-color', '#ccc');
		
		d3.select('.property-thumbnail').attr('src', thisListing.attr('data-thumbnail'));
		d3.select('.property-address').html(
			thisListing.attr('data-street')
			 + ', ' 
			 + thisListing.attr('data-city')
			 + ' '
			 + thisListing.attr('data-zipcode')
		);
		d3.select('.zillow-link').attr('href', thisListing.attr('data-homedetailslinks'));
		d3.select('.asking-price').html(thisListing.attr('data-askingprice'));
		d3.select('.bedroom-count').html(thisListing.attr('data-bedrooms'));
		d3.select('.bathroom-count').html(thisListing.attr('data-bathrooms'));
		d3.select('.finished-sqft').html(thisListing.attr('data-finishedsqft'));
		d3.select('.lot-sqft').html(thisListing.attr('data-lotsizesqft'));
		
		//remove iso layer if any
		try {
			map.removeLayer('iso');
			map.removeSource('iso');
		} catch {
			console.log('no such layer/source');
		}
		
		//add isochrone layer
		var isochromeUrl = 'https://api.mapbox.com/isochrone/v1/mapbox/driving/'
			+ thisListing.attr('data-lon') + ',' + thisListing.attr('data-lat') +'?contours_minutes=3,5,10&contours_colors=238b45,66c2a4,b2e2e2&polygons=true&access_token=' + mapboxgl.accessToken;

		//draw isochrone layer
		d3.json(isochromeUrl)
			.then(function(res) {
				map.addLayer( {
					'id': 'iso',
					'type': 'fill',
					'layout': {},
					'paint': {
						'fill-color': {
							'type': 'identity',
							'property': 'color' 
						},
						'fill-opacity': 0.6
					},
					'source': {
						'type': 'geojson',
						'data': res
					}
				});
			});			
		

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