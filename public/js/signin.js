async function checkSignIn(){
    let status = true;
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;
    // let formData = new FormData();
    let data = {email:email,pass:pass};

    const xhttp = new XMLHttpRequest();
    xhttp.onload = async function() {
        let res = xhttp.responseText;
        if(res=="ok"){
            alert("login Successfull");
        }
        else{
            // document.querySelector('.err').innerHTML = res;
            alert(res);
            status =  false;
        }
    }
    //all is good till now, but yet to stop the form submit when the credentials dont match
    //ok ekhon restrict kortese, but alert dekhaitese na -_-
    
    // Send a request
    xhttp.open("POST", "/auth/check-login");
    xhttp.setRequestHeader("Content-Type","application/json");
    xhttp.send(JSON.stringify(data));
    return status;
}