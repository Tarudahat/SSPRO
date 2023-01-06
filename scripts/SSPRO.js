"use strict"

console.log("SSPRO.js ran");


async function check_bool(bool_name) {
    let rtrn_bool = false;
    await browser.storage.local.get(bool_name).then((show_bool) => { rtrn_bool = show_bool[bool_name] });
    return rtrn_bool;
}

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
        e.innerText = ".topnav,.login-app__platform-indicator{background-color:" + a["navbar_color"] + " !important;}\nbody{border-top-color:" + a["navbar_color"] + "!important}";
        if (document.head == null) { apply_theme(); };
        document.head.appendChild(e);
    });
    await browser.storage.local.get("bg_color").then((a) => {
        let e = document.createElement("style");
        e.innerText = "option,.spacer,.showLeftNav,.detailContainerBlockValue,.content_container,.contentContainer,.smsc-container,body,.smsc-contextmenu-bubble,.selectionContainer,.agenda_grid_main,.topnav__menu,.bubble,.helper--height--mega,td,.dialog-content,.side-panel__panel,.wide-toolbar,.wide-toolbar__item,.wide-toolbar__item--selected,.topnav__menu-arrow,.msgDetail--empty,.messageframe,.toolbar,.folders,.smscleftnavcontainer,.msgContentVal,.smsc-contextmenu-arrow::before{background-color:" + a["bg_color"] + " !important;}\n.smsc-contextmenu-arrow::after,.topnav__menu-arrow::after{border-color:" + a["bg_color"] + " #0000 !important;}";
        document.head.appendChild(e);
    });
    await browser.storage.local.get("bg2_color").then((a) => {
        let e = document.createElement("style");
        e.innerText = ".smsc-column-nav__button:hover,.bootstrap__input,select,.skinButton,.skinButtonBg,.wide-toolbar__item::after,.wide-toolbar__item::before,.smsc-dropzone,.modern-message--selected,.blob,.navNextInput,.navPrevInput,.float-label__input,.input-search,.smscButton,.course-ico,.btn,checkbox {background-color:" + a["bg2_color"] + " !important; border-color:" + a["bg2_color"] + " !important;}\n.cell--spacer{border-color:" + a["bg2_color"] + " #0000 !important;}";
        document.head.appendChild(e);
    });
    await browser.storage.local.get("border").then((a) => {
        let e = document.createElement("style");
        if (!a["border"]) {
            e.innerText = ".msgInfoSpacer,.detailContainerBlock,.seperator,.toolbar-top,.toolbar-bottom,.navigation_container,.border{background-image: url() !important;}\nfieldset,.course-session-page__container,.centerxy,.centerx,.centery{background-color: transparent !important}";
            if (!window.location.href.includes("composeMessage")) {
                e.innerText += "\n td{ background-image: url()!important; }";
            };
        };
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

