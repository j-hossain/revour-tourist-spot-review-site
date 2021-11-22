function updateProfile(form){
    let formData = new FormData(form);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = async function() {
        let res = xhttp.responseText;
        if(res=="ok"){
            alert("Profile updated");
        }
        else{
            alert(res);
        }
    }
    xhttp.open("POST", "/profile/update");
    xhttp.send(formData);

    return false;
}

function changeProfilePicture(form){
    let formData = new FormData(form);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = async function() {
        let res = JSON.parse(xhttp.responseText);
        if(res.status==400){
            document.getElementById('currentPicture').src ="/uploads/"+ res.src;
        }
        else{
            alert(res.err);
        }
    }
    xhttp.open("POST", "/profile/update-picture");
    xhttp.send(formData);

    return false;
}