$( document ).ready(function() {
    console.log( "ready!" );
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        pos = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        console.log('Position: ',position);
        console.log(pos);
        $('#lat').html(pos.latitude);
        $('#lng').html(pos.longitude);
        $("#sendLocation").attr("href", `https://www.google.com/maps?q=${pos.latitude},${pos.longitude}`);
        
    });
});