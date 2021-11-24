let uploadedImages = new Array();
let places;
let selectedLocation;

$("#title").on('change', function(){
    var selectedVal = $(this).val();
    getLocation(selectedVal);                                                                                                                                      
});

$("#category").on('change', function(){
    var selectedVal = $(this).val();
    selectedLocation.category = selectedVal;                                                                                                                                   
});

async function getLocation(selectedOption){
    let locationName = places[selectedOption].place_name;
    let exactLocation = searchPlaces(locationName);
    let locationData = await serachLocationInDatabase(exactLocation);
    selectedLocation = locationData;
    console.log(selectedLocation);
}

function serachLocationInDatabase(exactLocation){
    let locationFromDatabase;
    let locationData = new FormData();
    locationData.set('lat',exactLocation.center[0]);
    locationData.set('lgn',exactLocation.center[1]);
    let xttp = new XMLHttpRequest();
    xttp.onload = function(){
        let res = JSON.parse(this.responseText);
        console.log(res);
        if(res.found){
            locationFromDatabase = res;
            setCategory(res.category);
        }
        else{
            locationFromDatabase = res;
            locationFromDatabase.lat = exactLocation.center[0];
            locationFromDatabase.lgn = exactLocation.center[1];
            locationFromDatabase.name= exactLocation.place_name;
        }
    }
    xttp.open("POST","/maps/search",false);
    console.log(exactLocation);
    xttp.send(locationData);
    return locationFromDatabase;
}

function searchPlaces(text){
    let target;
    text = text.replace(/ /g,"%20");
    let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+text+".json?access_token=pk.eyJ1IjoiamFoaW4iLCJhIjoiY2t1djh1aGRzNjZ0MTJxbWFmaGMzOGQzNiJ9.b-Wd6M4fUQEWwnXQEkq26g";
    let xttp = new XMLHttpRequest();
    xttp.onload = function(){
        let places = JSON.parse(this.responseText).features;
        target = places[0];
    }
    xttp.open("GET",url,false);
    xttp.send();
    return target;
}

function setCategory(category){
    let selects = document.getElementById("category");
    
    selects.childNodes.forEach(option => {
        if(option.innerHTML==category){
            option.selected='selected';
        }
    });
    selects.disabled=true;
}


function uploadImage(form){
    let image = document.getElementById("image");
    let formdata = new FormData(form);

    const imageUpload = new XMLHttpRequest();
    imageUpload.onload = async function() {
        let res = JSON.parse(imageUpload.responseText);
        if(res.status==400){
            uploadedImages.push(res.src);
            addPreview(res.src,uploadedImages.length-1);
            image.value="";
        }
        else{
            alert(res.err);
        }
    }
    imageUpload.open("POST", "/upload");
    imageUpload.send(formdata);
    return false;
}

function addPreview(src, index){
    let div = document.getElementById("imagesPreview");
    let imageDiv = document.createElement('div');
    let image = document.createElement('img');
    let crossButton = createCrossButton(index);
    image.classList.add('previewImage');
    imageDiv.classList.add("preImageDiv");
    image.src = "/uploads/"+ src;
    imageDiv.id = "preImage"+index;
    imageDiv.appendChild(image)
    imageDiv.appendChild(crossButton);
    div.appendChild(imageDiv);
}

function createCrossButton(index){
    let span = document.createElement('span');
    span.innerHTML = '<i class="fas fa-times"></i>';
    span.classList.add("cross-button");
    span.dataset.image = index;
    span.onclick = function(){
        removeImage(this.dataset.image);
    }
    return span;
}

function removeImage(imageIndex){
    let parentDiv = document.getElementById("imagesPreview");
    let imageDiv = document.getElementById('preImage'+imageIndex);
    parentDiv.removeChild(imageDiv);
    let newImages = new Array();
    for(let i=0;i<uploadedImages.length;i++){
        if(i!=imageIndex)
            newImages.push(uploadedImages[i]);
    }
    uploadedImages = newImages;
}



function publishReview(){
    const form = document.getElementById('reviewForm');
    let details = tinymce.get('details').getContent();
    let foodCulture = tinymce.get('foodCulture').getContent();
    let residential = tinymce.get('residential').getContent();
    let riskFactors = tinymce.get('risk').getContent(); 
    let season = form.querySelector('#season').value;
    let locationId = getLocationId();
    let reviewId = insertReview(locationId);
    let rating = $('#rating').val();
    addImagestoDataBase(reviewId);
    let detailsData = new FormData();
    detailsData.set('id',reviewId);
    detailsData.set('rating',rating);
    detailsData.set('foodCulture',foodCulture);
    detailsData.set('residential',residential);
    detailsData.set('riskFactors',riskFactors);
    detailsData.set('season',season);
    detailsData.set('details',details);


    let insertDetails = new XMLHttpRequest();
    insertDetails.onload = function(){
        let res = JSON.parse(insertDetails.responseText);
        if(res.status){
            alert("The post has been published");
            location.assign("/review/show/"+reviewId);
        }
        else{
            alert(res.error);
        }
    }
    insertDetails.open("POST","/review/adddetails");
    insertDetails.send(detailsData);
    return false;
}

function getLocationId(){
    if(!selectedLocation.found){
        let locationData = new FormData();
        locationData.set('name',selectedLocation.name);
        locationData.set('lgn',selectedLocation.lgn);
        locationData.set('lat',selectedLocation.lat);
        locationData.set('category',selectedLocation.category);
        
        const addLocation = new XMLHttpRequest();
        addLocation.onload = function() {
            let res = JSON.parse(addLocation.responseText);
            if(res.status){
                selectedLocation.id = res.id;
            }
            else{
                alert(res.error);
            }
        }
        addLocation.open("POST", "/maps/add",false);
        addLocation.send(locationData);
    }
    return selectedLocation.id;
}

function insertReview(locatioId){
    let reviewId;
    let reviewdata =  new FormData();
    reviewdata.set('title',selectedLocation.name);
    reviewdata.set('location',locatioId);
    let insertRev = new XMLHttpRequest();
    insertRev.onload = function(){
        let res = JSON.parse(insertRev.responseText);
        if(res.status){
            reviewId = res.id;
        }
        else{
            alert(res.error);
        }
    }
    insertRev.open("POST","/review/insert",false);
    insertRev.send(reviewdata);
    return reviewId;
}

function addImagestoDataBase(reviewId){
    let imagesData = new FormData();
    imagesData.set('images',uploadedImages);
    imagesData.set('reviewId',reviewId);
    let addRequest = new XMLHttpRequest();
    addRequest.onload = function(){
        let res = JSON.parse(addRequest.responseText);
        if(!res.status){
            alert(res.error);
        }
    }
    addRequest.open("POST","/review/addimages",true);
    addRequest.send(imagesData);
}


onMarkerClick = (lng,lat)=>{
    let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+lng+","+lat+".json?access_token="+access_token;
    let xttp = new XMLHttpRequest();
    xttp.onload = function(){

        places = JSON.parse(this.responseText).features;
        let optionBox = document.getElementById('title');
        optionBox.innerHTML = '<option value="null">Select a place from the marker</option>';
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

