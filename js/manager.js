"use strict";

// Firebase Class
class FirebaseManager {
	constructor(url) {
		this.url = url || ""; // Firebase base url
		this.client = null;
	}
}

FirebaseManager.prototype.connection = function(secure, token) {
	this.client = new Firebase(this.url);
	
	if(secure){
		this.client.authWithCustomToken(token || this.api_token, function(error, authData) {
		    if (error)
		    	alert("Please check firebase's api token");
		},{
		    remember: "sessionOnly"
		});
	}
}

FirebaseManager.prototype.get_ride = function(ride_id) {
	return this.client.child('ride_' + ride_id);
};


// Google Maps Class
class GoogleMaps {
	constructor(map){
		this.map = map;
		this.marker = null;
	}
}

var googlem;

function init_map(){
	var myLatlng = new google.maps.LatLng(41.1119553, 29.0576034);

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 9,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var trafficLayer = new google.maps.TrafficLayer();
	trafficLayer.setMap(map);

	googlem = new GoogleMaps(map);
}

GoogleMaps.prototype.drawRoute = function(ride) {
	// fitbounds
	var end_location = null, end_destination = null;
	var start_location = new google.maps.LatLng(ride.start_location.latitude, ride.start_location.longitude);

	if(ride.end_location) {
		end_location = new google.maps.LatLng(ride.end_location.latitude, ride.end_location.longitude);
		end_destination = { lat: parseFloat(ride.end_location.latitude), lng: parseFloat(ride.end_location.longitude) }
	}
	else {
		end_location = new google.maps.LatLng(parseFloat(ride.l[0]), parseFloat(ride.l[1]));
		end_destination = { lat: parseFloat(ride.l[0]), lng: parseFloat(ride.l[1]) }
	}
	
	var bounds = new google.maps.LatLngBounds();
	bounds.extend(start_location);
	bounds.extend(end_location);
	this.map.fitBounds(bounds);

	var directionsDisplay = new google.maps.DirectionsRenderer({
		map: this.map
	});

	var request = {
		destination: {
			lat: parseFloat(end_destination.lat),
			lng: parseFloat(end_destination.lng)
		},
		origin: {
			lat: parseFloat(ride.start_location.latitude),
			lng: parseFloat(ride.start_location.longitude)
		},
		travelMode: google.maps.TravelMode.DRIVING
	};

	var directionsService = new google.maps.DirectionsService();
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		}
	});

	var marker = new google.maps.Marker({
		map: this.map,
		animation: google.maps.Animation.DROP,
		position: {
			lat: parseFloat(ride.l[0]),
			lng: parseFloat(ride.l[1])
		}
	});

	this.marker = marker;
};

GoogleMaps.prototype.goTo = function(lat, lng) {
	var latlng = new google.maps.LatLng(lat, lng);
    this.marker.setPosition(latlng);
};

