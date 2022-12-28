"use strict"

var home_url;
var rtrn_val;

function react2response(response_msg) {
    if(response_msg){
    rtrn_val=response_msg.SUS;
    }else{
        console.log("RESPONSE FAILED");
    }
}

function send_message_2_bg(msg){
    const sent = browser.runtime.sendMessage(msg);
    sent.then(react2response).catch((error)=>{console.error(error);});
}

home_url=document.referrer.split(".be")[0]+".be";
document.getElementById("exit_btn").href=home_url+"/logout";
document.getElementsByTagName("style")[0].innerHTML.replace("=1=",home_url+"/smsc/svg/exit_ic_white/exit_ic_white_24x24.svg"); 

document.getElementById("rtrn_btn").addEventListener("click",()=>{history.back()});