var volt = new FirebaseManager();

volt.connection(
	secure=true, 
	token= API_TOKEN); // Firebase api token

ride_child = volt.get_ride(RIDE_ID); // Ride or Ride Request url

ride_child.once("value", function(snapshot) {
	ride = snapshot.val();
	googlem.drawRoute(ride);
}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);
});

ride_child.on("child_changed", function(snapshot){
	var l = snapshot.val();
	console.log('go to' + l[0] + '-' + l[1]);
	googlem.goTo(l[0], l[1]);
}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);
});

ride_child.on("child_removed", function(snapshot){
	alert('ride finished');
}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);
});
