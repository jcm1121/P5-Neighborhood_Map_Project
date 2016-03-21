
var model = {
    livermoreHotspotsArray: [
        {
            name: 'V&E Club',
            address: '2071 First St',
            latLng: {lat: 37.680984, lng: -121.770174}

        },
            {
            name: 'First Street Wine',
            address: '2211 First St',
            latLng: {lat: 37.681460, lng: -121.768434}
        },
        {
            name: 'Sansar indian Cuisine',
            address: '2220 First St',
            latLng: {lat: 37.681848, lng: -121.768849}
        },
        {
            name: 'Panama Red Coffee Co.',
            address: '2115 First S',
            latLng: {lat: 37.681094, lng: -121.769726}
        },
        {
            name: 'Sauced BBQ and Spirits',
            address: '2300 First St #120',
            latLng: {lat: 37.682666, lng: -121.768160}
        },
        {
            name: 'Los Caporeles Taquiria',
            address: '2130 First St',
            latLng: {lat: 37.681561, lng: -121.769756}
        },
        {
            name: 'Double Barrel Wine Bar',
            address: '2086 First St',
            latLng: {lat: 37.681451, lng: -121.770129}
        },
        {
            name: 'First Street Alehouse',
            address: '2106 First St',
            latLng: {lat: 37.681543, lng: -121.769975}
        }
    ]
};

//Hotspot Constructor
var HotSpot = function(data) {
    this.hotSpotName = ko.observable(data.name);
    this.hotSpotLatLng = ko.observable(data.latLng);
};

var ViewModel = function() {

    //declare self to represent this ViewModel.
    var self = this;

    //declare markerArray and last marker, and map
    var markerArray = [];
    var lastMarker = 0;
    var map = null;

    //declare hotSpotList observable array
    self.hotSpotList = ko.observableArray([]);

    //load hotSpotList observable array with model data.
    model.livermoreHotspotsArray.forEach(function(arrayItem) {
        self.hotSpotList.push(new HotSpot(arrayItem));
        console.log('hotSpotList name : ' + self.hotSpotList()[0].hotSpotName);
    });

    //declare current hotSpot
    self.currentHotSpot = ko.observable(this.hotSpotList()[0]);

    //declare query observable used to search hotSpotList
    self.query = ko.observable('');

    initialize = function() {
        var mapProp = {
          //center:new google.maps.LatLng(37.6819, -121.7681),
          center:new google.maps.LatLng(37.6819, -121.7681),
          zoom:15,
          mapTypeId:google.maps.MapTypeId.ROADMAP
        };

        //declare map and assign a new google map
        map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

        var addMarkers = function () {
            //loop through the model data and create a marker,
            //info window, and click event listner for each hotspot element
            for(var i=0; i < model.livermoreHotspotsArray.length; i++) {

                //assign lattitude/longitude & name values
                var latLng = model.livermoreHotspotsArray[i].latLng;
                var name = model.livermoreHotspotsArray[i].name;

                //assign each element of the marker array
                //with the hotspot lattitude/longitude
                markerArray[i] = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    title: name,
                    animation: google.maps.Animation.DROP,
                    clickable: true
                });

                //declare an infowindow for each marker
                markerArray[i].infowindow = new google.maps.InfoWindow({
                        content: markerArray[i].title
                    });

                //declare a click event for each marker
                //close last infowindow and open current infowindow
                markerArray[i].addListener('click', (function(marker) {
                    return function() {
                        markerArray[lastMarker].infowindow.close();
                        markerArray[lastMarker].setAnimation(null);
                        lastMarker = setLastMarker(marker.title);
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                        marker.infowindow.open(map, marker);
                    }
                })(markerArray[i]));
            };
        };
        addMarkers();
    };



    setLastMarker = function(name) {
        console.log('setLastMarker incoming name is: ' + name);
        for(var i=0; i < model.livermoreHotspotsArray.length; i++) {
            if  (model.livermoreHotspotsArray[i].name === name) {
                console.log(i);
                return i;
            }
        };
    };


    this.viewHotSpot = function(hotSpot) {
        //set current hotSpot to the hotSpot
        //clicked in the list
        self.currentHotSpot(hotSpot);

        markerArray[lastMarker].infowindow.close();
        markerArray[lastMarker].setAnimation(null);
        console.log('last marker value : ' + lastMarker);
        lastMarker = setLastMarker(self.currentHotSpot().hotSpotName());
        console.log('last marker value after assignment : ' + lastMarker);
        openHotSpotInfoWindow(hotSpot);
    };

    openHotSpotInfoWindow = function(hotSpot) {
        console.log('openHotSpotInfoWindow name is: ' + hotSpot.hotSpotName());
        for(var i=0; i < markerArray.length; i++) {
            if  (markerArray[i].title === hotSpot.hotSpotName()) {
                markerArray[i].setAnimation(google.maps.Animation.BOUNCE);
                markerArray[i].infowindow.open(map, markerArray[i]);
            }
        };
    };


google.maps.event.addDomListener(window, 'load', initialize());



};

ko.applyBindings(new ViewModel());
