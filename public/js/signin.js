async function checkSignIn(){
    let status = true;
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;
    let data = {email:email,pass:pass};

    const xhttp = new XMLHttpRequest();
    
    xhttp.onload = function() {
        let res = xhttp.responseText;
        if(res=="ok"){
            alert("login Successfull");
            return;
        }
        else{
            alert(res);
            status =  false;
            return;
        }
    }
    
    // Send a request
    xhttp.open("POST", "/auth/check-login",false);
    xhttp.setRequestHeader("Content-Type","application/json");
    xhttp.send(JSON.stringify(data));
    return status;
}