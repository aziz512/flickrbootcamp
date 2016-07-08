/* global $ */
var data;
var markers = [];

function submit()
{
    if ($('#input').val()) {
        var query = $('#input').val();
        var api = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=72543fa8d84e1666f30a1a11f0f1203a&format=json&has_geo=1';
        api += '&text='+query;
        $.get(api,{})
        .done(
            function(json){
                var result = json.replace('jsonFlickrApi(','');
                result = result.substring(0, result.length-1);
                data = JSON.parse(result);
                //data = json;
                for (var i = 0; i < data.photos.photo.length; i++) {
                    addPoint(i);
                }
            }
        )
        .fail(
            function(){
                
            }
        );
    }
}
function addPoint(i){
    var img = data.photos.photo[i];
    var locationApi = 'https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=72543fa8d84e1666f30a1a11f0f1203a&format=json';
    locationApi += '&photo_id=' + img.id;
    console.log(locationApi);
    $.get(locationApi, {})
    .done(
        function(info){
            var result = info.replace('jsonFlickrApi(','');
            result = result.substring(0, result.length-1);
            info = JSON.parse(result);
            var lat = info.photo.location.latitude;        
            var lng = info.photo.location.longitude;
            
            var myLatlng = new google.maps.LatLng(lat, lng);
            var marker = new google.maps.Marker({
                position: myLatlng,
                title:img.title
            });
            marker.addListener('click',function(){
                $('#imgDisplayer').attr('src',imgUrl);
                $('.popup').show();
            });
            marker.setMap(map);
            markers.push(marker);
            
            var imgUrl = 'https://farm'+ img.farm +'.staticflickr.com/' + img.server + '/' + img.id + '_' + img.secret + '.jpg';
        }
    )
    .fail(function(){
        
    });
}
function closePopup() {
    $('.popup').hide();
}
function clearAll(){
    $('#input').val('');
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}