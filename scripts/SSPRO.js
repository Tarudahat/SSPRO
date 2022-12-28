"use strict";

console.log("SSPRO.js ran");

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

function go_2_settings(){
    console.log(window.location.href.split(".be")[0]+".be");
    send_message_2_bg({cs_msg:window.location.href.split(".be")[0]+".be"});
    window.location.href = browser.runtime.getURL("html_pages/SSPRO_settings.html");
}

//create some css stuff
var css_element = document.createElement("style");
css_element.innerHTML = ".smsc-topnav .topnav__btn--icon--SSPRO{background-image: url('"+browser.runtime.getURL("icons/SSPRO_setting.png")+"');}";
document.head.appendChild(css_element);


//add the sspro btn to the topnav
var topnav = document.getElementsByTagName("nav")[0];
var sspro_settings_btn = document.createElement("button");
sspro_settings_btn.className="topnav__btn topnav__btn--icon topnav__btn--icon--SSPRO";
sspro_settings_btn.title="SSPRO instellingen";
sspro_settings_btn.onclick=go_2_settings;
topnav.appendChild(sspro_settings_btn);


//<a href="/logout" class="js-btn-logout topnav__btn topnav__btn--icon topnav__btn--icon--exit" title="Afmelden"></a>

