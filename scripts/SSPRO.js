"use strict"

console.log("SSPRO.js ran");

function go_2_settings(){
    let temp_str = "{\"sspro_home_url\": \""+window.location.href.split(".be")[0]+".be"+"\"}";
    let temp_obj = JSON.parse(temp_str);
    browser.storage.local.set(temp_obj);
    setTimeout(function(){window.location.href = browser.runtime.getURL("html_pages/SSPRO_settings.html");},100);
}

async function rmv_dvj(){
    let show_bool;
    await browser.storage.local.get("show_dvj").then((show_bool)=>{if(show_bool.show_dvj){}else{document.getElementById("homepage__block--student-support").remove();};});   
}

async function check_ppl_bool(){
    let show_bool=false;
    let rtrn_bool=false;
    await browser.storage.local.get("purple_score").then((show_bool)=>{rtrn_bool=show_bool.purple_score});
    return rtrn_bool;
}

function scrape_pplscore_nodes(){
    let prg_list = document.getElementsByClassName("progress-ring__content");

    for(let i = 0; i<prg_list.length;i++){
        let scraped_score = Number(prg_list[i].innerText.split("%")[0]);
        if(isNaN(scraped_score))
        {
            if(Number(prg_list[i].innerText.split("\n")[1].split("%")[0])>=95){
                let score_block = prg_list[i].parentNode.parentNode;
                score_block.className = score_block.className.replace("-blue-combo--","-purple-combo--");
                score_block.getElementsByTagName("circle")[0].style.cssText = score_block.getElementsByTagName("circle")[0].style.cssText.replace("blue","purple");
                score_block.getElementsByTagName("circle")[1].style.cssText = score_block.getElementsByTagName("circle")[1].style.cssText.replace("blue","purple");
            }
        }else if(scraped_score>=95)
        {
            let score_block = prg_list[i].parentNode.parentNode.parentNode;
            if(score_block.classList.contains("c-blue-combo--100")){
                score_block.className = score_block.className.replace("-blue-combo--","-purple-combo--");
                score_block.getElementsByTagName("circle")[0].style.cssText = score_block.getElementsByTagName("circle")[0].style.cssText.replace("blue","purple");
                score_block.getElementsByTagName("circle")[1].style.cssText = score_block.getElementsByTagName("circle")[1].style.cssText.replace("blue","purple");
                if(score_block.contains(score_block.getElementsByClassName("smsc-svg--message_feedback_blue--16")[0])){
                    score_block.getElementsByClassName("smsc-svg--message_feedback_blue--16")[0].className = score_block.getElementsByClassName("smsc-svg--message_feedback_blue--16")[0].className.replace("blue","purple");
                };
            }
            if(score_block.classList.contains("selected")){score_block.className = score_block.className.replace("-1","-2");}else{score_block.className = score_block.className.replace("-2","-1");};                
        }
    }

    prg_list = document.getElementsByClassName("graphic__text");
    for(let i = 0; i<prg_list.length;i++){
        let scraped_score = (Number(prg_list[i].title.replace(",",".").split("/")[0])/Number(prg_list[i].title.replace(",",".").split("/")[1]))*100;
        if(scraped_score>=95)
        {
            let score_block = prg_list[i].parentNode.parentNode.parentNode;
            score_block.className = score_block.className.replace("-blue-combo--","-purple-combo--");
            score_block.style.cssText = score_block.style.cssText.replace("blue","purple");
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
if(document.contains(document.getElementById("homepage__block--student-support"))){rmv_dvj();};
check_ppl_bool().then((use_ppl)=>{if(document.contains(document.getElementsByClassName("results")[0])&&use_ppl){setInterval(scrape_pplscore_nodes,80);};});

//<span title="32,5/35" class="graphic__text">32,5/35</span>