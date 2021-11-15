function updateProfile(){
    let form =  document.getElementById('updateProfile');
    let fullName = form["fullName"].value;
    let hometown = form["hometown"].value;
    let country = form["country"].value;
    let hobby = form["hobby"].value;
    let birthdate = form["birthdate"].value;
    let phone = form["phone"].value;
    let proPic = form["proPic"].value;

    let formData = {
        fullName:fullName,
        hometown: hometown,
        country: country,
        hobby:hobby,
        birthdate:birthdate,
        phone: phone,
        proPic: proPic
    };
    
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
    xhttp.setRequestHeader("Content-Type","application/json");
    xhttp.send(JSON.stringify(formData));

    return false;
}