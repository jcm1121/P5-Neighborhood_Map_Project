

var model = {
    livermoreHotspots: [
        {
            name: 'V&E Club',
            latLng: {lat: 37.680984, lng: -121.770174}
        },
            {
            name: 'First Street Wine',
            latLng: {lat: 37.681460, lng: -121.768434}
        },
        {
            name: 'Sansar indian Cuisine',
            latLng: {lat: 37.681848, lng: -121.768849}
        },
        {
            name: 'Panama Red Coffee Co.',
            latLng: {lat: 37.681094, lng: -121.769726}
        },
        {
            name: 'Tips & Toes Nail Spa',
            latLng: {lat: 37.681249, lng: -121.770753}
        },
        {
            name: 'Los Caporeles Taquiria',
            latLng: {lat: 37.681561, lng: -121.769756}
        },
        {
            name: 'Double Barrel Wine Bar',
            latLng: {lat: 37.681451, lng: -121.770129}
        },
        {
            name: 'First Street Alehouse',
            latLng: {lat: 37.681543, lng: -121.769975}
        }
    ]
};


var ViewModel = function() {

    //assign this to self represents the ViewModel (this)
    var self = this;

};

ko.applyBindings(new ViewModel());




var mapView = {

    initialize: function() {
        var mapProp = {
          //center:new google.maps.LatLng(37.6819, -121.7681),
          center:new google.maps.LatLng(37.6819, -121.7681),
          zoom:15,
          mapTypeId:google.maps.MapTypeId.ROADMAP
        };


        var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);

        //initialize last marker and its infowindow
        var lastMarker = new google.maps.Marker({
            position: model.livermoreHotspots[0].latLng,
            map: map,
            title: model.livermoreHotspots[0].name,
            clickable: true
        });
        lastMarker.infowindow = new google.maps.InfoWindow({
            content: lastMarker.title
        });
        console.log('lastMarker value is: ' + lastMarker);

        var addMarkers = function () {
            for(var i=0; i < model.livermoreHotspots.length; i++) {

                var latLng = model.livermoreHotspots[i].latLng;
                var name = model.livermoreHotspots[i].name;

                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    title: name,
                    clickable: true
                });


                marker.addListener('click', (function(marker) {
                    lastMarker.infowindow.close();
                    lastMarker = marker;
                    marker.infowindow = new google.maps.InfoWindow({
                        content: marker.title
                    });
                    return function() {marker.infowindow.open(map, marker);}
                    })(marker) );
            };
        };
        addMarkers();
    }
};

var mapListView = {

    initialize: function() {


    }
};


google.maps.event.addDomListener(window, 'load', mapView.initialize);
