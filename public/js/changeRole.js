function updateRole(form){
    let formData = new FormData(form);
    // console.log(formData.get("userId"));
    const xhttp = new XMLHttpRequest();
    xhttp.onload = async function() {
        let res = xhttp.responseText;
        if(res=="ok"){
            alert("User role updated");
        }
        else{
            alert(res);
        }
    }
    xhttp.open("POST", "/control-panel/update-role/"+formData.get("userId")+"/"+formData.get("user-role")+"");
    xhttp.send(formData);

    return false;
}