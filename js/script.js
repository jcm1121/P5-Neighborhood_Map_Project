
var model = {
    livermoreHotspotsArray: [
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



var mapView = {

    initialize: function() {
        var mapProp = {
          //center:new google.maps.LatLng(37.6819, -121.7681),
          center:new google.maps.LatLng(37.6819, -121.7681),
          zoom:15,
          mapTypeId:google.maps.MapTypeId.ROADMAP
        };

        var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);

        var addMarkers = function () {
            //initialize last marker and its infowindow
            var markerArray = [];
            var lastMarker = 0;
            for(var i=0; i < model.livermoreHotspotsArray.length; i++) {

                var latLng = model.livermoreHotspotsArray[i].latLng;
                var name = model.livermoreHotspotsArray[i].name;

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
                        markerArray[lastMarker].setAnimation(null);
                        lastMarker = mapView.setLastMarker(marker.title);
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                        marker.infowindow.open(map, marker);
                    }
                })(markerArray[i]) );
            };
        };
        addMarkers();
    },


    setLastMarker: function(name) {
        console.log('getLastMarker incoming name is: ' + name);
        for(var i=0; i < model.livermoreHotspotsArray.length; i++) {
            if  (model.livermoreHotspotsArray[i].name === name) {
                console.log(i);
                return i;
            }
        };
    }
};

var HotSpot = function(data) {
    this.hotSpotName = ko.observable(data.name);
    this.hotSpotLatLng = ko.observable(data.latLng);
};




var ViewModel = function() {


    //declare self to represent this ViewModel.
    var self = this;

    //declare hotSpotList observable arary
    this.hotSpotList = ko.observableArray([]);

    //load hotSpotList observable array with model data.
    model.livermoreHotspotsArray.forEach(function(hotSpot) {
        self.hotSpotList.push(new HotSpot(hotSpot));
    });
};

ko.applyBindings(new ViewModel());
google.maps.event.addDomListener(window, 'load', mapView.initialize);