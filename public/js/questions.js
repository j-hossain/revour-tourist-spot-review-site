function postQuestion(form){
    let questionData = new FormData(form);
    let postQ = new XMLHttpRequest();
    postQ.onload = function(){
        let res = JSON.parse(postQ.responseText)
        if(res.status){
            createQuestionDiv(res.question);
        }
        else{
            alert(res.error.toString());
        }
    }
    postQ.open("POST","/question/ask",true);
    postQ.send(questionData);
    return false;
}

function createQuestionDiv(questionData){
    location.reload();
}