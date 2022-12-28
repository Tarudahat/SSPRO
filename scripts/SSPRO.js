"use strict";

console.log("SSPRO.js ran");

function go_2_settings(){
    var temp_str = "{\"sspro_home_url\": \""+window.location.href.split(".be")[0]+".be"+"\"}";
    var temp_obj = JSON.parse(temp_str);
    browser.storage.local.set(temp_obj);
    setTimeout(function(){window.location.href = browser.runtime.getURL("html_pages/SSPRO_settings.html");},100);
}

//create some css stuff
var css_element = document.createElement("style");
css_element.innerHTML = ".smsc-topnav .navbar_btn_icon_SSPRO{background-image: url('"+browser.runtime.getURL("icons/SSPRO_setting.png")+"');}";
css_element.innerHTML += ".topbar{display: flex; align-items: center; padding: 0;height: 48px;min-height: 48px;background: #f5ff15;}";
document.head.appendChild(css_element);


//add the sspro btn to the topnav
var topnav = document.getElementsByTagName("nav")[0];
topnav.className="topbar";
var sspro_settings_btn = document.createElement("button");
sspro_settings_btn.className="topnav__btn topnav__btn--icon .navbar_btn_icon_SSPRO";
sspro_settings_btn.title="SSPRO instellingen";
sspro_settings_btn.onclick=go_2_settings;
topnav.appendChild(sspro_settings_btn);

