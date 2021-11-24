function tickIt(button){
    if(button.classList.contains("checked"))
        return false;
    let reviewId = button.dataset.review;
    let userId = button.dataset.user;

    let tickRequest = new XMLHttpRequest();
    tickRequest.onload = ()=>{
        let res = JSON.parse(tickRequest.responseText);
        if(!res.status){
            alert(res.error);
        }
        else{
            location.reload();
        }
    }
    tickRequest.open("POST","/review/react/tick/"+reviewId+"/"+userId,true);
    tickRequest.send();
}

function reportIt(button){
    if(button.classList.contains("checked"))
        return false;
    let reviewId = button.dataset.review;
    let userId = button.dataset.user;

    let reportRequest = new XMLHttpRequest();
    reportRequest.onload = ()=>{
        let res = JSON.parse(reportRequest.responseText);
        if(!res.status){
            alert(res.error);
        }
        else{
            location.reload();
        }
    }
    reportRequest.open("POST","/review/react/report/"+reviewId+"/"+userId,true);
    reportRequest.send();
}