var map;

var private = {
    init:function(lat,lon){

        if(lat&&lon){
		
            var position = {
                coords:{
                    latitude:lat,
                    longitude:lon
                }
            };
            private.showMap(position);
            map.addMarker({lng:lon,lat:lat,title:'Tu negocio'});
        }else{
            var position = {
                coords:{
                    latitude:'-32.90466555338632',
                    longitude:'-68.8458799690294'
                }
            };
            private.showMap(position);
            //navigator.geolocation.getCurrentPosition(private.showMap,private.error);
        }
    },

    showMap:function(position){
        //Mostramos el mapa
        map = new GMaps({
            div: '#map',
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            zoom:12,
            click: function(e) {
                map.removeMarkers();
                map.addMarker({lng:e.latLng.lng(),lat:e.latLng.lat()});
                private.setLocation(e.latLng.lng(),e.latLng.lat());
            }
        });
    },

    error:function(err){
        var position = {
            coords:{
                latitude:'-33',
                longitude:'-68'
            }
        };
        private.showMap(position);
    },

    setLocation:function(lon,lat){
        $('#lat').val(lat);
        $('#lon').val(lon);
    }
};