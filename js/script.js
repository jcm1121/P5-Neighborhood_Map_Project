
var Model = {
    livermoreHotspotsArray: [
        {
            name: 'Livermore 13 Cinemas',
            latLng: {lat: 37.6835518, lng: -121.7673569},
            id: 'livermore-13-cinemas-livermore'
        },
        {
            name: 'V&E Club',
            latLng: {lat: 37.680984, lng: -121.770174},
            id: 'v-and-e-club-livermore'
        },
            {
            name: 'First Street Wine Company',
            latLng: {lat: 37.681460, lng: -121.768434},
            id: 'first-street-wine-company-livermore'
        },
        {
            name: 'Sansar Indian Cuisine',
            latLng: {lat: 37.681848, lng: -121.768849},
            id: 'sansar-indian-cuisine-livermore-4'
        },
        {
            name: 'Panama Red Coffee',
            latLng: {lat: 37.681094, lng: -121.769726},
            id: 'panama-red-coffee-livermore'
        },
        {
            name: 'Sauced BBQ & Spirits',
            latLng: {lat: 37.682666, lng: -121.768160},
            id: 'sauced-bbq-and-spirits-livermore'
        },
        {
            name: 'Taqueria Los Caporales',
            latLng: {lat: 37.681561, lng: -121.769756},
            id: 'taqueria-los-caporales-livermore'
        },
        {
            name: 'Double Barrel Wine Bar',
            latLng: {lat: 37.681451, lng: -121.770129},
            id: 'double-barrel-wine-bar-livermore'
        },
        {
            name: 'First Street Alehouse',
            latLng: {lat: 37.681543, lng: -121.769975},
            id: 'first-street-alehouse-livermore'
        }
    ]
};

//Hotspot Constructor
var HotSpot = function(data) {
    this.hotSpotName = ko.observable(data.name);
    this.hotSpotLatLng = data.latLng;
    this.hotSpotId = data.id;
};


var ViewModel = function() {

                    //declare self to represent this ViewModel.
                    var self = this;

                    //declare markerArray, last marker, and map
                    var markerArray = [];
                    var lastMarker = 0;
                    var map = null;




                    //declare hotSpotList observable array
                    self.hotSpotList = ko.observableArray([]);

                    //load hotSpotList observable array with Model data.
                    Model.livermoreHotspotsArray.forEach(function(arrayItem) {
                        self.hotSpotList.push(new HotSpot(arrayItem));
                    });

                    //declare current hotSpot
                    self.currentHotSpot = ko.observable(this.hotSpotList()[0]);

                    //declare query observable used to search hotSpotList
                    self.query = ko.observable('');

                    //declare search computed observable to render the filtered
                    //hotSpotList elements on the page
                    self.search = ko.computed(function() {
                        console.log('calling clearMarkers from seach');
                        clearMarkers();
                        return ko.utils.arrayFilter(self.hotSpotList(), function(hotSpot) {
                            if (hotSpot.hotSpotName().toLowerCase().indexOf(self.query().toLowerCase()) >= 0)
                                setMarker(hotSpot);
                            return hotSpot.hotSpotName().toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
                        });
                    });


    initialize = function() {
        console.log('entering initialize function');
        var mapProp = {
          center:new google.maps.LatLng(37.6819, -121.7681),
          zoom:15,
          mapTypeId:google.maps.MapTypeId.ROADMAP
        };

        //declare map and assign a new google map
        map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

        //loop through the model data creating a marker, infowindow,
        //click event, and make an AJAX call to yelp for infowindow content
        //on each model data entry
        var addMarkers = function () {
            //loop through the Model data and create a marker,
            //info window, and click event listner for each hotspot element
            for(var i=0; i < Model.livermoreHotspotsArray.length; i++) {

                //assign lattitude/longitude & name values
                var id = Model.livermoreHotspotsArray[i].id;
                var latLng = Model.livermoreHotspotsArray[i].latLng;
                var name = Model.livermoreHotspotsArray[i].name;


                var contentString = '';

                YELP_KEY = 'VjJd2U6caWsD2g38tKHMXQ';
                YELP_TOKEN = 'gyokE6rE7mBgDJLRtS_5KDs5fg8JiQwf';
                YELP_KEY_SECRET = 'CYxufrUy2vCYVt1IZeY-gl2PBTc';
                YELP_TOKEN_SECRET = 'soyEBse-Ftw2yEeROG6sGoSgc6Q';
                YELP_BASE_URL = 'https://api.yelp.com/v2/';

               /**
                 * Generates a random number and returns it as a string for OAuthentication
                 * @return {string}
                 */
                function nonce_generate() {
                  return (Math.floor(Math.random() * 1e12).toString());
                }

                //declare and build the yelp url
                var yelp_url = YELP_BASE_URL + 'business/' + Model.livermoreHotspotsArray[i].id;

                var parameters = {
                    oauth_consumer_key: YELP_KEY,
                    oauth_token: YELP_TOKEN,
                    oauth_nonce: nonce_generate(),
                    oauth_timestamp: Math.floor(Date.now()/1000),
                    oauth_signature_method: 'HMAC-SHA1',
                    oauth_version : '1.0',
                    callback: 'cb'
                };

                var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
                parameters.oauth_signature = encodedSignature;

                var settings = {
                    url: yelp_url,
                    data: parameters,
                    cache: true,
                    dataType: 'jsonp',
                    success: function(results) {
                        //assign variables from the AJAX response
                        console.log('inside ajax success: ' + results.name);
                        var name = results.name;
                        var address = results.location.display_address[0];
                        var phone = results.phone;
                        var rating = results.rating;
                        var img = results.image_url;
                        contentString =
                            '<div id="iw-container">'+
                                '<div id="iw-body">'+
                                    '</div>'+
                                        '<h3 id="iw-title" class="iw-title">'+ name + '</h3>'+
                                        '<div id="iwContent">'+
                                            '<h4> Rating: ' + rating + '</h4>' +
                                            '<p>' + phone + '</p>'+
                                            '<p>' + address + '</p>'+
                                            '<img class="iw-img" src="' + img + '">' +
                                        '</div>'+
                                    '</div>' +
                                '</div>' +
                            '</div>';

                        //call setSetInfoWindowContent passing
                        //the name and content string
                        setInfoWindowContent(name, contentString);

                    },
                    fail: function() {
                        console.log('yelp call failed')
                    }
                };
                // Send AJAX query via jQuery library.
                $.ajax(settings);

                //assign each element of the marker array
                //with the hotspot lattitude/longitude
                markerArray[i] = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    title: name,
                    animation: google.maps.Animation.DROP,
                    clickable: true
                });

                console.log('just before infowindow contentString: ' + contentString);
                //declare an infowindow for each marker
                markerArray[i].infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                //declare a click event for each marker
                //close last infowindow and open current infowindow
                markerArray[i].addListener('click', (function(marker) {
                    return function() {
                        markerArray[lastMarker].infowindow.close();
                        markerArray[lastMarker].setAnimation(null);
                        lastMarker = setLastMarkerIndex(marker.title);
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                        marker.infowindow.open(map, marker);
                    }
                })(markerArray[i]));
            }; //end of for loop
        };//end of addMarkers function
        addMarkers();
    }; //end of initialize function


    //Remove the markers from the map, but keep them in the array.
    function clearMarkers() {
        console.log('clearMarkers');
        for (var i = 0; i < markerArray.length; i++) {
            markerArray[i].infowindow.close();
            markerArray[i].setMap(null);
        };
    };

    //search the markerArray for a matching name and turn on marker 'setMap'
    function setMarker(hotSpot) {
        console.log('set marker name.toLowerCase is: ' + hotSpot.hotSpotName().toLowerCase());
        for(var i=0; i < markerArray.length; i++) {
            if  (markerArray[i].title.toLowerCase() === hotSpot.hotSpotName().toLowerCase()) {
                console.log('inside setMarker setting marker: ' + markerArray[i].title);
                markerArray[i].setMap(map);
            }
        };
    };

    //return the index of the marker that matches the name passed
    setLastMarkerIndex = function(name) {
        console.log('setLastMarkerIndex incoming name is: ' + name);
        for(var i=0; i < Model.livermoreHotspotsArray.length; i++) {
            if  (Model.livermoreHotspotsArray[i].name === name) {
                console.log(i);
                return i;
            }
        };
    };

    //this function is called from the
    //click event on the hotspotlist element
    this.viewHotSpot = function(hotSpot) {
        //set current hotSpot to the hotSpot
        //clicked in the list
        self.currentHotSpot(hotSpot);

        //close last marker
        markerArray[lastMarker].infowindow.close();
        markerArray[lastMarker].setAnimation(null);
        //set clicked marker to last marker
        lastMarker = setLastMarkerIndex(self.currentHotSpot().hotSpotName());

        //open clicked marker by searching the markerArray
        //for a name match and open that marker's infowindow
        for(var i=0; i < markerArray.length; i++) {
            if  (markerArray[i].title === hotSpot.hotSpotName()) {
                markerArray[i].setAnimation(google.maps.Animation.BOUNCE);
                markerArray[i].infowindow.open(map, markerArray[i]);
            }
        };
    };

    //search markerArray for name match and
    //set infowindow content
    setInfoWindowContent = function(name, content) {
            for(var i=0; i < markerArray.length; i++) {
                console.log('inside for loop of infowindw')
                if  (markerArray[i].title === name) {
                    console.log('InfoWindowContent name is:' + name);
                    markerArray[i].infowindow.setContent(content);
                };
            };
    };



    console.log('end of View Model');
    google.maps.event.addDomListener(window, 'load', initialize());

};  //end of View Model


function googleSuccess() {
    console.log('in googleSuccess');
    ko.applyBindings(new ViewModel());
};
function googleError() {
    alert('Sorry we seem to have lost our internet connection');
    console.log('in googleError');
};



