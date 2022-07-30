function updateRewards(form){
    let formData = new FormData(form);
    const xhttp = new XMLHttpRequest();
    let unique_location = formData.get("unique_location");
    let max_tick = formData.get("max_tick");
    let per_tick = formData.get("per_tick");
    let per_answer = formData.get("per_answer");
    let max_answer = formData.get("max_answer");
    let new_user = formData.get("new_user");
    xhttp.onload = async function() {
        let res = xhttp.responseText;
        if(res=="ok"){
            alert("Rewards updated");
        }
        else{
            alert(res);
        }
    }
    xhttp.open("POST", "/control-panel/update-reward/"+unique_location+"/"+new_user+"/"+per_tick+"/"+max_tick+"/"+per_answer+"/"+max_answer);
    xhttp.send(formData);

    return false;
}