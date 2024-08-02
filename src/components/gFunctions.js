export const disableAllInputs = function(e) {
    var allSelects = document.querySelectorAll("select");
    var i;
    for(i = 0; i < allSelects.length; i++){
        allSelects[i].disabled = e;
    }
    var allInputs = document.querySelectorAll("input");
    var i;
    for(i = 0; i < allInputs.length; i++){
        allInputs[i].disabled = e;
    }
    var allButtons = document.querySelectorAll("button");
    var i;
    for(i = 0; i < allButtons.length; i++){
        allButtons[i].disabled = e;
    }
    var allTextarea = document.querySelectorAll("textarea");
    var i;
    for(i = 0; i < allTextarea.length; i++){
        allTextarea[i].disabled = e;
    }
}
