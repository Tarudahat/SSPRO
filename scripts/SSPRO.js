"use strict";

console.log("SSPRO.js ran");

function go_2_settings(){
    var temp_str = "{\"sspro_home_url\": \""+window.location.href.split(".be")[0]+".be"+"\"}";
    var temp_obj = JSON.parse(temp_str);
    browser.storage.local.set(temp_obj);
    setTimeout(function(){window.location.href = browser.runtime.getURL("html_pages/SSPRO_settings.html");},100);
}

async function rmv_dvj(){
    var show_bool;
    await browser.storage.local.get("show_dvj").then((show_bool)=>{if(show_bool.show_dvj){}else{document.getElementById("homepage__block--student-support").remove();}; console.log(show_bool);});
}

function scrape_score_nodes(){
    console.log(document.getElementsByClassName("evaluation-graphic__progress-ring__value")[0]);
    var list_scores = document.getElementsByClassName("progress-ring__content");
    console.log(list_scores);
    var purple_scores = [];
    for(var score in list_scores){
    
        if (Number(score.innerText.split("&")[0])>=95)
        {
            purple_scores.append(score);
            console.log(score);
        }
    }
}

//create some css stuff
var css_element = document.createElement("style");
css_element.innerHTML = ".smsc-topnav .navbar_btn_icon_SSPRO{background-image: url('"+browser.runtime.getURL("icons/SSPRO_setting.png")+"');}";
document.head.appendChild(css_element);

//add the sspro btn to the topnav
var topnav = document.getElementsByTagName("nav")[0];
var sspro_settings_btn = document.createElement("button");
sspro_settings_btn.className="topnav__btn topnav__btn--icon navbar_btn_icon_SSPRO";
sspro_settings_btn.title="SSPRO instellingen";
sspro_settings_btn.onclick=go_2_settings;
topnav.appendChild(sspro_settings_btn);

//apply options
/*<div class="evaluation-graphic evaluation-graphic--large evaluation-graphic--percentage side-panel__content__score__large-ring c-blue-combo--100"><div style="width: 128px; height: 128px;" class="progress-ring"><svg width="128px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" class="progress-ring__svg"><circle cx="64" cy="64" r="59" class="progress-ring__svg__stroke" style="stroke: var(--c-blue--200); stroke-width: 10px;"></circle><circle cx="64" cy="64" r="59" class="progress-ring__svg__bar" style="stroke: var(--c-blue--500); stroke-width: 10px; stroke-linecap: round; stroke-dasharray: 370.708px, 370.708px; stroke-dashoffset: 26.0354px;"></circle></svg><div class="progress-ring__content"><div class=""><span class="evaluation-graphic__progress-ring__description">9,5/10</span><span class="evaluation-graphic__progress-ring__value">95%</span></div></div></div></div>*/

if(document.contains(document.getElementById("homepage__block--student-support"))){rmv_dvj();};

