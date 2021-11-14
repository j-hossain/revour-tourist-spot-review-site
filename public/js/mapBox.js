
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
    selectedPlace.setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>"))
    onMarkerClick(e.lngLat.lng,e.lngLat.lat);
    
});

function searchPlaces(){
    let text = document.querySelector('.searchPlace').value.toString();
    text = text.replace(/ /g,"%20");
    console.log(text);
    let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+text+".json?access_token=pk.eyJ1IjoiamFoaW4iLCJhIjoiY2t1djh1aGRzNjZ0MTJxbWFmaGMzOGQzNiJ9.b-Wd6M4fUQEWwnXQEkq26g";
    let xttp = new XMLHttpRequest();
    xttp.onload = function(){
        console.log(JSON.parse(this.responseText));
        let places = JSON.parse(this.responseText).features;
        console.log(places);
        for(let i=0;i<places.length;i++)
            createMarker(places[i].center[0],places[i].center[1]);
    }
    xttp.open("GET",url,true);
    xttp.send();
}

function createMarker(lng,lat){
    let marker = new mapboxgl.Marker();
    marker.setLngLat([lng, lat])
    marker.addTo(map);
    return marker;
}