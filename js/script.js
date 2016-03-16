
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
            name: 'Sauced BBQ and Spirits',
            latLng: {lat: 37.682666, lng: -121.768160}
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

//Hotspot Constructor
var HotSpot = function(data) {
    this.hotSpotName = ko.observable(data.name);
    this.hotSpotLatLng = ko.observable(data.latLng);
};

var ViewModel = function() {

    //declare self to represent this ViewModel.
    var self = this;

    //declare markerArray and last marker
    var markerArray = [];
    var lastMarker = 0;

    //declare hotSpotList observable array
    this.hotSpotList = ko.observableArray([]);

    //load hotSpotList observable array with model data.
    model.livermoreHotspotsArray.forEach(function(arrayItem) {
        self.hotSpotList.push(new HotSpot(arrayItem));
        console.log('hotSpotList name : ' + self.hotSpotList()[0].hotSpotName);
    });

    //declare current hotSpot
    this.currentHotSpot = ko.observable(this.hotSpotList()[0]);


    initialize = function() {
        var mapProp = {
          //center:new google.maps.LatLng(37.6819, -121.7681),
          center:new google.maps.LatLng(37.6819, -121.7681),
          zoom:15,
          mapTypeId:google.maps.MapTypeId.ROADMAP
        };

        //declare map and assign a new google map
        var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);

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

//        hotSpot.setAnimation(google.maps.Animation.BOUNCE);
//        this.hotSpot.infowindow.open(map, this.hotSpot);

    };


google.maps.event.addDomListener(window, 'load', initialize());



};

ko.applyBindings(new ViewModel());
