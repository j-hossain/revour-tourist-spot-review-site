
let reviewId = document.getElementById('reviewId').value;
console.log(reviewId);

let xttp = new XMLHttpRequest();
xttp.onload = ()=>{
    let res = JSON.parse(xttp.responseText);
    for(let i=0;i<res.images.length;i++){
        addPreview(res.images[i],i);
    }
}
let url = '/review/getbyid/'+reviewId;
xttp.open("GET",url);
xttp.send();

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
    // let parentDiv = document.getElementById("imagesPreview");
    // let imageDiv = document.getElementById('preImage'+imageIndex);
    // parentDiv.removeChild(imageDiv);
    // let newImages = new Array();
    // for(let i=0;i<uploadedImages.length;i++){
    //     if(i!=imageIndex)
    //         newImages.push(uploadedImages[i]);
    // }
    // uploadedImages = newImages;
}
