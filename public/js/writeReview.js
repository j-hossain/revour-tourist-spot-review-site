
function publishReview(){
    const form = document.getElementById('reviewForm');
    let details = tinymce.get('details').getContent();
    let foodCulture = tinymce.get('foodCulture').getContent();
    let residential = tinymce.get('residential').getContent();
    let riskFactors = tinymce.get('risk').getContent(); 
    let season = form.querySelector('#season').value;
    return false;
}

onMarkerClick = (lng,lat)=>{
    let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+lng+","+lat+".json?access_token="+access_token;
    let xttp = new XMLHttpRequest();
    xttp.onload = function(){

        let places = JSON.parse(this.responseText).features;
        let optionBox = document.getElementById('title');
        optionBox.innerHTML = "";
        for(let i=0;i<places.length;i++){
            let placeName = places[i].place_name;
            let option = document.createElement('option');
            option.value = i;
            option.innerHTML = placeName;
            optionBox.appendChild(option);
        }
    }
    xttp.open("GET",url,true);
    xttp.send();
};


function markerClicked(){
}

