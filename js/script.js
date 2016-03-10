

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

    //set self to represent the ViewModel (this)
    var self = this;

};






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
        var markerArray = [];
        var lastMarker = 0;


        var addMarkers = function () {
            for(var i=0; i < model.livermoreHotspots.length; i++) {

                var latLng = model.livermoreHotspots[i].latLng;
                var name = model.livermoreHotspots[i].name;

                markerArray[i] = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    title: name,
                    animation: google.maps.Animation.DROP,
                    clickable: true
                });
                markerArray[i].infowindow = new google.maps.InfoWindow({
                        content: markerArray[i].title
                    });

                markerArray[i].addListener('click', (function(marker) {
                    return function() {
                        markerArray[lastMarker].infowindow.close();
                        lastMarker = mapView.setLastMarker(marker.title);
                        marker.infowindow.open(map, marker);
                    }
                    })(markerArray[i]) );
            };
        };
        addMarkers();
    },

    setLastMarker: function(name) {
        console.log('getLastMarker incoming name is: ' + name);
        for(var i=0; i < model.livermoreHotspots.length; i++) {
            if  (model.livermoreHotspots[i].name === name) {
                console.log(i);
                return i;
            }
        };
    }
};

var mapListView = {

    initialize: function() {


    }
};


google.maps.event.addDomListener(window, 'load', mapView.initialize);
