function postQuestion(form){
    let questionData = new FormData(form);
    let postQ = new XMLHttpRequest();
    postQ.onload = function(){
        let res = JSON.parse(postQ.responseText)
        if(res.status){
            location.reload();
        }
        else{
            alert(res.error.toString());
        }
    }
    postQ.open("POST","/question/ask",true);
    postQ.send(questionData);
    return false;
}


function postAnswer(form){
    let answerData = new FormData(form);
    let postA = new XMLHttpRequest();
    postA.onload = function(){
        let res = JSON.parse(postA.responseText)
        if(res.status){
            location.reload();
        }
        else{
            alert(res.error.toString());
        }
    }
    postA.open("POST","/question/answer",true);
    postA.send(answerData);
    return false;
}
