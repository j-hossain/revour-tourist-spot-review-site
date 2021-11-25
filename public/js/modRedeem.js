let allRedeemRequests = new Array();
let ration = 1
fetchRedeemRequests();

function fetchRedeemRequests(){
    let redeemReuest = new XMLHttpRequest();
    redeemReuest.onload = function(){
        let res = JSON.parse(redeemReuest.responseText);
        if(res.status==false){
            alert(res.error);
        }
        else{
            allRedeemRequests = res.requests;
            showAll("pending");
        }
    }
    redeemReuest.open('GET','/redeem/all-requests');
    redeemReuest.send();
}

function showAll(status){
    console.log(allRedeemRequests);
    activateButtons(status);
    let parentDiv = document.getElementById("requestList");
    parentDiv.innerHTML = "";
    parentDiv.appendChild(getHeading());
    for(let i=0;i<allRedeemRequests.length;i++){
        if(allRedeemRequests[i].status==status || status=="true"){
            let row = createRow(allRedeemRequests[i]);
            parentDiv.appendChild(row);
        }
    }
}

function activateButtons(id){
    let target = document.getElementById(id);
    let parent = document.querySelector(".FilterButtons");
    for(let i=0;i<parent.children.length;i++){
        parent.children[i].children[0].classList.add('btn-outline-primary');
        parent.children[i].children[0].classList.remove('btn-primary');
    }
    target.classList.add("btn-primary");
    target.classList.remove("btn-outline-primary");
}

function getHeading(){
    let requestRow = document.createElement('div');
    requestRow.classList.add("requestRow");
    requestRow.classList.add("heading");
    let userCol = createColumn("user",createSpan("User"));
    let pointCol = createColumn("point",createSpan("Point"));
    let statusCol = createColumn("status",createSpan("Status"));
    let amountCol = createColumn("amount",createSpan("Amount"));
    let actionCol = createColumn("action",createSpan("Action"));
    requestRow.appendChild(userCol);
    requestRow.appendChild(pointCol);
    requestRow.appendChild(statusCol);
    requestRow.appendChild(amountCol);
    requestRow.appendChild(actionCol);
    return requestRow;
}

function createRow(rr){
    let requestRow = document.createElement('div');
    requestRow.classList.add("requestRow");
    let userCol = createColumn("point",createProfileLink(rr.user.id,rr.user.username));
    let pointCol = createColumn("point",createSpan(rr.req_point));
    let statusCol = createColumn("status",createSpan(rr.status));
    let amountCol = createColumn("amount",createSpan(rr.req_point*ration));
    let actionCol = createActionCol(rr);
    requestRow.appendChild(userCol);
    requestRow.appendChild(pointCol);
    requestRow.appendChild(statusCol);
    requestRow.appendChild(amountCol);
    requestRow.appendChild(actionCol);
    return requestRow;
}

function createProfileLink(userId, username){
    let link = document.createElement('a');
    link.href="/profile/about/"+userId;
    link.innerHTML = username;
    return link;
}

function createColumn(className,inner){
    let col = document.createElement('div');
    col.classList.add("reqCol",className);
    col.appendChild(inner);
    return col;
}

function createSpan(text){
    let span = document.createElement('span');
    span.innerHTML=text;
    return span;
}

function createActionCol(redeem){
    let status = redeem.status;
    if(status=="pending"){
        let form = document.createElement('form');
        let trxNumInp = document.createElement('input');
        trxNumInp.placeholder = "transaction number"
        let button = document.createElement('button');
        button.classList.add("btn","btn-primary");
        button.innerHTML = "Send";
        button.dataset.reqid = redeem.id;
        button.onclick = ()=>{
            return acceptRequest(redeem.id,trxNumInp);
        }
        let div = document.createElement('div');
        div.classList.add('reqCol');
        form.appendChild(trxNumInp);
        form.appendChild(button);
        div.appendChild(form);
        return createColumn("action",div);
    }
    else if(status=="accepted"){
        return createColumn("action",createProfileLink(redeem.accepted_by,"Accepted By"));
    }
    else if(status=="completed"){
        return createColumn("action",createSpan("Completed"));
    }
}

function acceptRequest(reqId,trxInp){
    let transactionNumber = trxInp.value;
    let acceptRequest = new XMLHttpRequest();
    acceptRequest.onload = function(){
        let res = JSON.parse(acceptRequest.responseText);
        if(res.status==false){
            alert(res.error);
        }
        else{
            alert("Transaction id sent");
            location.reload();
        }
    }
    acceptRequest.open('GET',"/redeem/accept/"+reqId+"/"+transactionNumber);
    acceptRequest.send();
    return false;
}