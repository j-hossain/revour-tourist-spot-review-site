let profileInfo = document.getElementById("userID");
let userId = profileInfo.dataset.userid;
let allRedeemRequests = new Array();
let ration = 1
fetchRedeemRequests(userId);

function sendRedeemRequest(form){
    let redeemRequestData = new FormData(form);
    redeemRequestData.set('user_id',userId);
    let requestedPoint = redeemRequestData.get('redeem_point');
    let available = document.getElementById('currentPoint').dataset.point;
    if(requestedPoint<100){
        alert("Minimum redeem request is 100")
    }
    else if(requestedPoint>available){
        alert("Not enough points");
    }
    else{
        let redeemReuest = new XMLHttpRequest();
        redeemReuest.onload = function(){
            let res = JSON.parse(redeemReuest.responseText);
            if(res.status==false){
                alert(res.error);
            }
            else{
                alert("Request submitted");
                location.reload();
            }
        }
        redeemReuest.open('POST','/redeem/request');
        redeemReuest.send(redeemRequestData);
    }
    return false;
}

function fetchRedeemRequests(userId){
    let redeemReuest = new XMLHttpRequest();
    redeemReuest.onload = function(){
        let res = JSON.parse(redeemReuest.responseText);
        if(res.status==false){
            alert(res.error);
        }
        else{
            allRedeemRequests = res.requests;
            showAll("true");
        }
    }
    redeemReuest.open('GET','/redeem/user-requests/'+userId);
    redeemReuest.send();
}

function showAll(status){
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

function getHeading(){
    let requestRow = document.createElement('div');
    requestRow.classList.add("requestRow");
    requestRow.classList.add("heading");
    let pointCol = createColumn("point",createSpan("Point"));
    let statusCol = createColumn("status",createSpan("Status"));
    let amountCol = createColumn("amount",createSpan("Amount"));
    let actionCol = createColumn("action",createSpan("Action"));
    requestRow.appendChild(pointCol);
    requestRow.appendChild(statusCol);
    requestRow.appendChild(amountCol);
    requestRow.appendChild(actionCol);
    return requestRow;
}

function createRow(rr){
    let requestRow = document.createElement('div');
    requestRow.classList.add("requestRow");
    let pointCol = createColumn("point",createSpan(rr.req_point));
    let statusCol = createColumn("status",createSpan(rr.status));
    let amountCol = createColumn("amount",createSpan(rr.req_point*ration));
    let actionCol = createActionCol(rr);
    requestRow.appendChild(pointCol);
    requestRow.appendChild(statusCol);
    requestRow.appendChild(amountCol);
    requestRow.appendChild(actionCol);
    return requestRow;
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
        let button = document.createElement('button');
        button.classList.add("btn","btn-primary");
        button.innerHTML = "Cancle";
        button.dataset.reqid = redeem.id;
        button.onclick = ()=>{
            cancleRequest(button);
        }
        let div = document.createElement('div');
        div.classList.add('reqCol');
        div.appendChild(button);
        return createColumn("action",div);
    }
    else if(status=="accepted"){
        let button = document.createElement('button');
        button.classList.add("btn","btn-primary");
        button.innerHTML = "Confirm";
        button.dataset.reqid = redeem.id;
        button.onclick = ()=>{
            confirmRequest(button);
        }
        let div = document.createElement('div');
        div.classList.add('reqCol');
        div.appendChild(createSpan("Transaction Id: "+redeem.trx_id))
        div.appendChild(button);
        return createColumn("action",div);
    }
    else if(status=="completed"){
        return createColumn("action",createSpan("Completed"));
    }
}

function cancleRequest(button){
    let requestId = button.dataset.reqid;
    let cancleReuest = new XMLHttpRequest();
        cancleReuest.onload = function(){
            let res = JSON.parse(cancleReuest.responseText);
            if(res.status==false){
                alert(res.error);
            }
            else{
                alert("Request cancled");
                location.reload();
            }
        }
        cancleReuest.open('GET','/redeem/cancle/'+requestId);
        cancleReuest.send();
}

function confirmRequest(button){
    let requestId = button.dataset.reqid;
    let confirmReuest = new XMLHttpRequest();
        confirmReuest.onload = function(){
            let res = JSON.parse(confirmReuest.responseText);
            if(res.status==false){
                alert(res.error);
            }
            else{
                alert("Request confirmed");
                location.reload();
            }
        }
        confirmReuest.open('POST','/redeem/confirm/'+requestId);
        confirmReuest.send();
}