"use strict"

const btn_meta_array = [{ title: "Start", name: "home", has_popup: false },
{ title: "Vakken", name: "courses", has_popup: true },
{ title: "Berichten", name: "messages", has_popup: false },
{ title: "Meldingen", name: "notifs", has_popup: true },
{ title: "Ga naar", name: "shortcuts", has_popup: true }];

var number_of_new_msg;
var toast_hrefs = [];

function go_2_settings() {
    let temp_str = "{\"sspro_home_url\": \"" + window.location.href.split(".be")[0] + ".be" + "\"}";
    let temp_obj = JSON.parse(temp_str);
    browser.storage.local.set(temp_obj);
    setTimeout(function () { window.location.href = browser.runtime.getURL("html_pages/SSPRO_settings.html"); }, 100);
}

async function check_bool(bool_name) {
    let rtrn_bool = false;
    await browser.storage.local.get(bool_name).then((show_bool) => { rtrn_bool = show_bool[bool_name] });
    return rtrn_bool;
}

function inject_icon_css() {
    let css_element = document.createElement("style");

    for (let i = 0; i < btn_meta_array.length; i++) {
        css_element.innerText += "\n .smsc-topnav .navbar_btn_icon_SSPRO_" + btn_meta_array[i].name + "{background-image: url('" + browser.runtime.getURL("icons/SSPRO_" + btn_meta_array[i].name + ".png") + "') !important; transition-duration: 0s !important}";
    }
    css_element.innerText += "\n .SSPRO_notif_badge_messages{position:absolute !important;right:197px;top:24px}";
    css_element.innerText += "\n .SSPRO_notif_badge_notifs{position:absolute !important;top:24px}";
    css_element.innerText += "\n .btn_icon_graph{background-image: url('" + browser.runtime.getURL("icons/SSPRO_graph.png") + "') !important;}"
    document.head.appendChild(css_element);
}

async function apply_theme() {
    let cstm_theme_used;
    cstm_theme_used = false;
    await browser.storage.local.get("use_theme").then((use_theme_) => {
        cstm_theme_used = use_theme_["use_theme"];
        let css_element = document.createElement("style");
        css_element.innerText = ".smsc-topnav .navbar_btn_icon_SSPRO{background-image: url('" + browser.runtime.getURL("icons/SSPRO_setting.png") + "') !important;}";
        css_element.innerText += "\n.SSPRO_icon{background-image: url('" + browser.runtime.getURL("icons/SSPRO.png") + "') !important;}";
        if (!(document.head)) { apply_theme(); };
        check_bool("use_icon").then((() => { inject_icon_css(); }));
        document.head.appendChild(css_element);
    });

    if (window.location.href.includes("results")) {
        let btn_css_node = document.createElement("link");
        btn_css_node.rel = "stylesheet";
        btn_css_node.href = browser.runtime.getURL("/html_pages/SSPRO_btn.css");
        document.head.appendChild(btn_css_node);
    }

    if (cstm_theme_used) {
        await browser.storage.local.get("navbar_color").then((a) => {
            let e = document.createElement("style");
            e.innerText = ".topnav,.login-app__platform-indicator{background-color:" + a["navbar_color"] + " !important;}\nbody{border-top-color:" + a["navbar_color"] + "!important}";
            document.head.appendChild(e);
        });
        let bg2_color_temp;
        await browser.storage.local.get("bg2_color").then((a) => {
            let e = document.createElement("style");
            e.innerText = ".notification:hover,.wide-toolbar__item,.ui-button,.color_snow_white,.menu-item:hover,.modern-message__action:hover,.ui-button-icon,.topnav__menuitem:hover,.modern-message:hover,.smsc-column-nav__button:hover,.bootstrap__input,select,.skinButton,.skinButtonBg,.wide-toolbar__item::after,.wide-toolbar__item::before,.smsc-dropzone,.modern-message--selected,.blob,.navNextInput,.navPrevInput,.float-label__input,.input-search,.smscButton,.course-ico,.btn,checkbox {background-color:" + a["bg2_color"] + " !important; border-color:" + a["bg2_color"] + " !important;}\n.cell--spacer{border-color:" + a["bg2_color"] + " #0000 !important;}";
            bg2_color_temp = a["bg2_color"];
            document.head.appendChild(e);
        });
        await browser.storage.local.get("bg_color").then((a) => {
            let e = document.createElement("style");
            e.innerText = ".ui-dialog-buttonpane,.ui-dialog-titlebar,.ui-dialog,.modern-message__actions,.context-menu,.notifs-toaster__toast,option,.spacer,.showLeftNav,.detailContainerBlockValue,.content_container,.contentContainer,.smsc-container,body,.smsc-contextmenu-bubble,.selectionContainer,.agenda_grid_main,.topnav__menu,.bubble,.helper--height--mega,td,.dialog-content,.side-panel__panel,.wide-toolbar,.wide-toolbar__item--selected,.topnav__menu-arrow,.msgDetail--empty,.messageframe,.toolbar,.folders,.smscleftnavcontainer,.msgContentVal,.smsc-contextmenu-arrow::before{background-color:" + a["bg_color"] + " !important;}\n.smsc-contextmenu-arrow::after,.topnav__menu-arrow::after,.ui-dialog-titlebar{border-color:" + a["bg_color"] + " #0000 !important;}";
            e.innerHTML += " .bubble--tooltip{border-color:" + bg2_color_temp + " !important;background-color:" + bg2_color_temp + " !important;}\n .bubble--tooltip .bubble__arrow svg polyline{border-color:" + bg2_color_temp + " !important;stroke:" + bg2_color_temp + " !important;fill:" + bg2_color_temp + "!important;}";
            document.head.appendChild(e);
        });


    };

    await browser.storage.local.get("border").then((a) => {
        let e = document.createElement("style");
        if (!a["border"]) {
            e.innerText = ".msgInfoSpacer,.detailContainerBlock,.seperator,.toolbar-top,.toolbar-bottom,.navigation_container,.border{background-image: none !important;}\nfieldset,.course-session-page__container,.centerxy,.centerx,.centery{background-color: transparent !important;}\n.course-session-page__container{border: none !important;}";
            if (!window.location.href.includes("composeMessage")) {
                e.innerText += "\n td{ background-image: none!important; background-color: transparent !important}";
            };
            document.head.appendChild(e);
        };
    });
}


function apply_navbar_icons() {
    for (let i = 0; i < btn_meta_array.length; i++) {
        let current_btn = document.getElementsByClassName("js-btn-" + btn_meta_array[i].name)[0];
        if (btn_meta_array[i].title == "Berichten" || btn_meta_array[i].title == "Meldingen") {
            current_btn.innerText = current_btn.innerText.replace(btn_meta_array[i].title, "");
            if (current_btn.innerText.length >= 0) {
                let notif_badge = document.createElement("span");
                notif_badge.classList.add("topnav__badge", "SSPRO_notif_badge_" + btn_meta_array[i].name);
                notif_badge.innerText = current_btn.innerText;
                current_btn.innerText = "";
                current_btn.appendChild(notif_badge);
                if (current_btn.innerText.length == 0) { notif_badge.style.cssText = "visibility: hidden"; }
            }

        } else { current_btn.innerText = ""; }
        current_btn.classList.add("topnav__btn--icon", "navbar_btn_icon_SSPRO_" + btn_meta_array[i].name);
        current_btn.title = btn_meta_array[i].title;

        let menu_arrow_node = document.createElement("div");
        menu_arrow_node.classList.add("topnav__menu-arrow");
        if (btn_meta_array[i].has_popup) { current_btn.appendChild(menu_arrow_node); }
    }

    //updates the notifs indicator
    document.getElementsByClassName("js-btn-notifs")[0].onclick = function () { document.getElementsByClassName("js-btn-notifs")[0].getElementsByClassName("SSPRO_notif_badge_notifs")[0].style.cssText = "visibility: hidden"; };
}

function update_badges() {

    let msg_badge_node = document.getElementsByClassName("js-btn-messages")[0].getElementsByClassName("SSPRO_notif_badge_messages")[0];
    let notif_badge_node = document.getElementsByClassName("js-btn-notifs")[0].getElementsByClassName("SSPRO_notif_badge_notifs")[0];
    if (number_of_new_msg !== document.getElementsByClassName("modern-message--new").length) {
        if (document.getElementsByClassName("modern-message--new").length == 0) {
            msg_badge_node.style.cssText = "visibility: hidden";
        } else { msg_badge_node.style.cssText = "visibility: visible"; }
        msg_badge_node.innerText = String(document.getElementsByClassName("modern-message--new").length);
    }

    //toast_content
    for (let i = 0; i < document.getElementsByClassName("toast__btn").length; i++) {

        if (!toast_hrefs.includes(document.getElementsByClassName("toast__btn")[i].href)) {
            toast_hrefs.push(document.getElementsByClassName("toast__btn")[i].href);

            notif_badge_node.style.cssText = "visibility: visible";
            notif_badge_node.innerText = String(Number(notif_badge_node.innerText) + 1);

            if (document.getElementsByClassName("toast__btn")[i].href.includes("Messages")) {
                msg_badge_node.style.cssText = "visibility: visible";
                msg_badge_node.innerText = String(Number(msgwindow._badge_node.innerText) + 1);
            }
        }
    }
    number_of_new_msg = document.getElementsByClassName("modern-message--new").length;
}

//apply options
apply_theme();

if (!window.location.href.includes("table")) {
    browser.storage.local.set({ in_graph_mode: false });
}

//add the sspro btn to the topnav
document.addEventListener("DOMContentLoaded", function () {

    var topnav = document.getElementsByTagName("nav")[0];
    var sspro_settings_btn = document.createElement("button");
    sspro_settings_btn.className = "topnav__btn topnav__btn--icon navbar_btn_icon_SSPRO";
    sspro_settings_btn.title = "SSPRO instellingen";
    sspro_settings_btn.onclick = go_2_settings;
    topnav.appendChild(sspro_settings_btn);

    var sspro_settings_goto_btn = document.createElement("a");
    sspro_settings_goto_btn.href = browser.runtime.getURL("html_pages/SSPRO_settings.html");
    var role_attribute = document.createAttribute("role");
    role_attribute.value = "menuitem";
    sspro_settings_goto_btn.setAttributeNode(role_attribute);
    sspro_settings_goto_btn.classList.add("topnav__menuitem", "topnav__menuitem--icon", "SSPRO_icon");
    sspro_settings_goto_btn.title = "SSPRO Instellingen";
    sspro_settings_goto_btn.innerText = sspro_settings_goto_btn.title;
    document.getElementsByClassName("module-manual--24")[0].after(sspro_settings_goto_btn);


    check_bool("use_icon").then(((use_icons) => { if (use_icons) { apply_navbar_icons(); } }));

    if (document.contains(document.getElementById("homepage__block--student-support"))) {
        check_bool("show_dvj").then((show_bool) => { if (show_bool) { } else { document.getElementById("homepage__block--student-support").remove(); }; });
    };

    number_of_new_msg = document.getElementsByClassName("modern-message--new").length;

    //updates the msg indicator and notifs if needed
    if (window.location.href.includes("Messages")) { setInterval(update_badges, 200); }

});
