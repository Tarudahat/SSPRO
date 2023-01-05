"use strict"

console.log("SSPRO.js ran");

function go_2_settings() {
    let temp_str = "{\"sspro_home_url\": \"" + window.location.href.split(".be")[0] + ".be" + "\"}";
    let temp_obj = JSON.parse(temp_str);
    browser.storage.local.set(temp_obj);
    setTimeout(function () { window.location.href = browser.runtime.getURL("html_pages/SSPRO_settings.html"); }, 100);
}

async function rmv_dvj() {
    let show_bool;
    await browser.storage.local.get("show_dvj").then((show_bool) => { if (show_bool.show_dvj) { } else { document.getElementById("homepage__block--student-support").remove(); }; });
}

async function apply_theme() {
    await browser.storage.local.get("navbar_color").then((a) => {
        let e = document.createElement("style");
        e.innerText = ".topnav{background-color:" + a["navbar_color"] + " !important;}";
        if (document.head == null) { apply_theme(); };
        document.head.appendChild(e);
    });
    await browser.storage.local.get("bg_color").then((a) => {
        let e = document.createElement("style");
        e.innerText = "body{background-color:" + a["bg_color"] + " !important;}";
        document.head.appendChild(e);
    });
    var css_element = document.createElement("style");
    css_element.innerText = ".smsc-topnav .navbar_btn_icon_SSPRO{background-image: url('" + browser.runtime.getURL("icons/SSPRO_setting.png") + "') !important;}";
    document.head.appendChild(css_element);
}

//apply options
apply_theme();

//add the sspro btn to the topnav
document.addEventListener("DOMContentLoaded", function () {
    var topnav = document.getElementsByTagName("nav")[0];
    var sspro_settings_btn = document.createElement("button");
    sspro_settings_btn.className = "topnav__btn topnav__btn--icon navbar_btn_icon_SSPRO";
    sspro_settings_btn.title = "SSPRO instellingen";
    sspro_settings_btn.onclick = go_2_settings;
    topnav.appendChild(sspro_settings_btn);

    if (document.contains(document.getElementById("homepage__block--student-support"))) { rmv_dvj(); };
});