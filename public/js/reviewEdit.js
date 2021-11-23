let uploadedImages = new Array();
let reviewId = document.getElementById('reviewId').value;
console.log(reviewId);

let xttp = new XMLHttpRequest();
xttp.onload = ()=>{
    let res = JSON.parse(xttp.responseText);
    for(let i=0;i<res.images.length;i++){
        uploadedImages.push(res.images[i]);
        addPreview(res.images[i],i);
    }
}
let url = '/review/getbyid/'+reviewId;
xttp.open("GET",url);
xttp.send();


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
    //fix korte hobe
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
    console.log(uploadedImages);
    const form = document.getElementById('reviewForm');
    let details = tinymce.get('details').getContent();
    let foodCulture = tinymce.get('foodCulture').getContent();
    let residential = tinymce.get('residential').getContent();
    let riskFactors = tinymce.get('risk').getContent(); 
    let season = form.querySelector('#season').value;
    let rating = $('#rating').val();
    deleteAllImages(reviewId)
    addImagestoDataBase(reviewId);
    let detailsData = new FormData();
    detailsData.set('id',reviewId);
    detailsData.set('rating',rating);
    detailsData.set('foodCulture',foodCulture);
    detailsData.set('residential',residential);
    detailsData.set('riskFactors',riskFactors);
    detailsData.set('season',season);
    detailsData.set('details',details);


    let updateDetails = new XMLHttpRequest();
    updateDetails.onload = function(){
        let res = JSON.parse(updateDetails.responseText);
        if(res.status){
            alert("The post has been updated");
        }
        else{
            alert(res.error);
        }
    }
    updateDetails.open("POST","/review/updatedetails");
    updateDetails.send(detailsData);
    return false;
}

function deleteAllImages(reviewId){
    let xttp = new XMLHttpRequest();
    xttp.onload = ()=>{
        let res = JSON.parse(xttp.responseText);
        if(!res.status){
            alert(res.error);
        }
    }
    let url = '/review/deleteimages/'+reviewId;
    xttp.open("DELETE",url,false);
    xttp.send();
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