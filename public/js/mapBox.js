
let mapCenter = {lat:23.6820,lng:90.3563};
let selectedPlace;
let onMarkerClick;
let access_token = "pk.eyJ1IjoiamFoaW4iLCJhIjoiY2t1djh1aGRzNjZ0MTJxbWFmaGMzOGQzNiJ9.b-Wd6M4fUQEWwnXQEkq26g";

mapboxgl.accessToken = access_token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [mapCenter.lng, mapCenter.lat], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.on('click',(e)=>{
    if(typeof selectedPlace !== 'undefined'){
        selectedPlace.remove();
    }
    selectedPlace = createMarker(e.lngLat.lng,e.lngLat.lat);
    onMarkerClick(e.lngLat.lng,e.lngLat.lat);
    
});

function setCenter(){
    let places = searchPlaces();
    map.setCenter(places[0].center);
}

function searchPlaces(){
    let text = document.querySelector('.searchPlace').value.toString();
    text = text.replace(/ /g,"%20");
    console.log(text);
    let places;
    let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+text+".json?access_token=pk.eyJ1IjoiamFoaW4iLCJhIjoiY2t1djh1aGRzNjZ0MTJxbWFmaGMzOGQzNiJ9.b-Wd6M4fUQEWwnXQEkq26g";
    let xttp = new XMLHttpRequest();
    xttp.onload = function(){
        console.log(JSON.parse(this.responseText));
        places = JSON.parse(this.responseText).features;
        console.log(places);
    }
    xttp.open("GET",url,false);
    xttp.send();
    return places;
}

function createMarker(lng,lat){
    const el = document.createElement('div');
    el.id = 'marker';
    let marker = new mapboxgl.Marker(el);
    marker.setLngLat([lng, lat])
    marker.addTo(map);
    marker.setPopup(new mapboxgl.Popup({ offset: 25 }).setText("<h1>Hello World!</h1>"))
    return marker;
}

// a location object returned by mapbox
// {
//     "id": "place.17679718526840860",
//     "type": "Feature",
//     "place_type": [
//         "place"
//     ],
//     "relevance": 1,
//     "properties": {
//         "wikidata": "Q1354"
//     },
//     "text": "Dhaka",
//     "place_name": "Dhaka, Dhaka, Bangladesh",
//     "bbox": [
//         90.3297348,
//         23.66812134,
//         90.51279449,
//         23.90106392
//     ],
//      [longitude,latitude]
//     "center": [
//         90.403409,
//         23.784506
//     ],
//     "geometry": {
//         "type": "Point",
//         "coordinates": [
//             90.403409,
//             23.784506
//         ]
//     },
//     "context": [
//         {
//             "id": "district.13645051878840860",
//             "wikidata": "Q1850485",
//             "text": "Dhaka"
//         },
//         {
//             "id": "region.9831996884466970",
//             "wikidata": "Q330158",
//             "short_code": "BD-C",
//             "text": "Dhaka"
//         },
//         {
//             "id": "country.10043599301797340",
//             "wikidata": "Q902",
//             "short_code": "bd",
//             "text": "Bangladesh"
//         }
//     ]
// }