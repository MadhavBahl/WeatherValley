
    console.log( "ready!" );
    if (!navigator.geolocation) {
        alert('Geolocation not supported by your browser.');
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

        var name = document.getElementById('name').innerText;
        console.log('Name is: ',name);

        $("#chatApp").attr("href", `https://lets-go-chat.herokuapp.com/chat.html?name=${name}&room=Weather+Valley`);
        
        

    });
    function initMap() {
        var uluru = {lat: -25.363, lng: 131.044};
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 4,
                center: pos
            });
            var marker = new google.maps.Marker({
                position: pos,
                map: map
            });
        });
        
    }