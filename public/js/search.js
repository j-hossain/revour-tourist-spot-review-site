
let mapCenter = {lat:23.6820,lng:90.3563};
let onMarkerClick;
let access_token = "pk.eyJ1IjoiamFoaW4iLCJhIjoiY2t1djh1aGRzNjZ0MTJxbWFmaGMzOGQzNiJ9.b-Wd6M4fUQEWwnXQEkq26g";
let allReviews = new Array();
mapboxgl.accessToken = access_token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [mapCenter.lng, mapCenter.lat], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

function setCenter(){
    let places = searchPlaces();
    map.setCenter(places[0].center);
    map.setZoom(9);
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

function createMarker(lng,lat,reviewData){
    const el = document.createElement('div');
    el.id = 'marker';
    const div = window.document.createElement('div');
    let title = document.createElement('span');
    title.innerHTML = reviewData.title;
    let button = document.createElement('button');
    button.classList.add("btn","btn-primary","popUpBtn");
    button.innerHTML = "Show all from this location";
    button.onclick = ()=>{
        showReviewsByLocation(reviewData.location);
    }
    div.appendChild(title);
    div.appendChild(button);
    let marker = new mapboxgl.Marker(el);
    marker.setLngLat([lng, lat])
    marker.addTo(map);
    marker.setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(div));
    return marker;
}

function showReviewsByLocation(location){
    // console.log(location);
    // console.log(allReviews);
    let reviewsDiv = document.getElementById('reviews');
    reviewsDiv.innerHTML= "";
    allReviews.forEach(review => {
        if(review.location.id==location.id){
            let reviewBox = createReview(review,false);
            reviewsDiv.appendChild(reviewBox);
        }
    });
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


let getReviews = new XMLHttpRequest();
getReviews.onload = function(){
    allReviews  =JSON.parse(getReviews.responseText);
    setReviews(allReviews);
}
getReviews.open("GET","/review/getall");
getReviews.send();


function setReviews(reviewsData){
    let reviewsDiv = document.getElementById('reviews');
    reviewsData.forEach(review => {
        reviewsDiv.appendChild(createReview(review,true));
    });
    // let reviewBox = document.createElement('div');
    // reviewBox.classList.add('reviewBox');
    // let reviewPreview = '<div class="previewImage"><img src="/uploads/1637398137668Screenshot (26) - Copy.png" alt="PreviewImage"></div><div class="previewArticle"><span class="title">Place name</span><span class="experience">Lorem ipsum dolor sit amet consectetur adipisicing elit. Essevitae quaerat culpa repellendus cupiditate animi voluptatibus eum, asperiores sintamet.</span><div class="midDiv"><div class="rating"><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span></div><a href="#" class="author">Jahin Hossain</a></div><div class="buttons"><a href="/review/show/" class="btn btn-primary">Show</a><a href="" class="category">Sea Beach</a></div></div>';
    // reviewBox.innerHTML = reviewPreview;
}

function createReview(reviewData,createMark){
    let reviewBox = document.createElement('div');
    reviewBox.classList.add("reviewBox");
    let previewImage = document.createElement('div');
    previewImage.classList.add("previewImage");
    let image = document.createElement('img');
    image.src = "/uploads/"+reviewData.images[0];
    let previewArticle = document.createElement('div');
    previewArticle.classList.add("previewArticle");
    let title = document.createElement('span');
    title.classList.add("title");
    title.innerHTML = reviewData.title;
    let experience = document.createElement('span');
    experience.classList.add("experience");
    experience.innerHTML = reviewData.shorten;
    let midDiv = document.createElement('div');
    midDiv.classList.add('midDiv');
    let ratingDiv = document.createElement('div');
    ratingDiv.classList.add("rating");
    let checkedStar = document.createElement('span');
    checkedStar.classList.add("fa" ,"fa-star" ,"checked");
    let unCheckedStar = document.createElement('span');
    unCheckedStar.classList.add("fa" ,"fa-star");
    let author = document.createElement('a');
    author.href = "/profile/about/"+reviewData.user.id;
    author.innerHTML = reviewData.user.full_name;
    let buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add("buttons");
    let showBtn = document.createElement('a');
    showBtn.classList.add("btn","btn-primary");
    showBtn.href = "/review/show/"+reviewData.id;
    showBtn.innerHTML = "Show";
    let category = document.createElement('a');
    category.classList.add("category");
    category.href = "/review/show/"+reviewData.location.category;
    category.innerHTML = reviewData.location.category
    
    previewImage.appendChild(image);
    previewArticle.appendChild(title);
    previewArticle.appendChild(experience);
    previewArticle.appendChild(midDiv);
    previewArticle.appendChild(buttonsDiv);
    
    midDiv.appendChild(ratingDiv);
    midDiv.appendChild(author);
    
    buttonsDiv.appendChild(showBtn);
    buttonsDiv.appendChild(category);
    
    for(let i=1;i<reviewData.location_rating;i++){
        ratingDiv.appendChild(createCheckedStar());
    }
    for(let i=reviewData.location_rating;i<=6;i++){
        ratingDiv.appendChild(createunCheckedStar());
    }
    
    reviewBox.appendChild(previewImage);
    reviewBox.appendChild(previewArticle);
    if(createMark)
        createMarker(reviewData.location.lat,reviewData.location.lgn,reviewData);
    return reviewBox;
}

function createCheckedStar(){
    let checkedStar = document.createElement('span');
    checkedStar.classList.add("fa" ,"fa-star" ,"checked");
    return checkedStar;
}

function createunCheckedStar(){
    let unCheckedStar = document.createElement('span');
    unCheckedStar.classList.add("fa" ,"fa-star");
    return unCheckedStar;
}