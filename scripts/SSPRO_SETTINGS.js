"use strict"

var bar_wdth_style = document.createElement("style");
bar_wdth_style.innerText = ".navbar{width:" + String(window.outerWidth) + "px !important}";
document.head.appendChild(bar_wdth_style);

async function get_home_url() {
    let a;
    let home_url;
    await browser.storage.local.get("sspro_home_url").then((a) => { home_url = a.sspro_home_url; });
    document.getElementById("exit_btn").href = home_url + "/logout";
}

async function sync_btn2bool(bool_name) {
    let btn_classlist = document.getElementById(bool_name + "_btn").classList;
    let show_bool;
    await browser.storage.local.get(bool_name).then((show_bool) => {
        if (show_bool[bool_name]) {
            if (btn_classlist.contains("off")) { btn_classlist.remove("off"); }
        } else {
            btn_classlist.add("off");
        };
    });
}

async function toggle_bool(bool_name) {
    let btn_classlist = document.getElementById(bool_name + "_btn").classList;
    btn_classlist.toggle("off")
    if (btn_classlist.contains("off")) {
        browser.storage.local.set(JSON.parse("{\"" + bool_name + "\":false}"));
    }
    else {
        browser.storage.local.set(JSON.parse("{\"" + bool_name + "\":true}"));
    }
}

function set_clr_val(obj_name) {
    let temp_obj = "{\"" + obj_name + "\":\"" + document.getElementById(obj_name + "_btn").value + "\"}";

    browser.storage.local.set(JSON.parse(temp_obj));
}

async function get_clr_val(obj_name) {
    await browser.storage.local.get(obj_name).then((a) => {
        if (a[obj_name] !== "undefined") {
            document.getElementById(obj_name + "_btn").value = a[obj_name];
            switch (obj_name) {
                case "navbar_color":
                    document.getElementsByClassName("navbar")[0].style.cssText = "background:" + a[obj_name] + ";";
                    let e = document.createElement("style");
                    e.innerText = ".option_btn {border: 2px solid " + a[obj_name] + ";background-color:" + a[obj_name] + ";}";
                    document.head.appendChild(e);
                    break;
                case "bg_color":
                    document.body.style.cssText = "background:" + a[obj_name] + ";";
                    break;
                case "bg2_color":
                    document.getElementById("swap_img_txt").style.cssText = "background:" + a[obj_name] + ";";
                    document.getElementById("rmv_nodes_txt").style.cssText = "background:" + a[obj_name] + ";";
            }
        }
    });

}

async function rtrn_theme_2_normal() {
    let cba = [document.getElementById("navbar_color_btn"), document.getElementById("bg_color_btn"), document.getElementById("bg2_color_btn")];
    if (document.getElementById("use_theme_btn").classList.contains("off")) {

        for (let i = 0; i < cba.length; i++) {
            cba[i].value = "#FFFFFF";
            cba[i].disabled = true;
        }
        cba[0].value = "#FF520E";

        set_clr_val("navbar_color");
        set_clr_val("bg2_color");
        set_clr_val("bg_color");
        get_clr_val("navbar_color");
        get_clr_val("bg2_color");
        get_clr_val("bg_color");
    } else {
        cba[0].disabled = false;
        cba[1].disabled = false;
        cba[2].disabled = false;
    }
}

async function set_strg_txt(obj_name) {
    //remove " and ' from txt the value
    document.getElementById(obj_name).value = String(document.getElementById(obj_name).value.replace("\"", "").replace("'", ""));
    //actually set the local storage value
    browser.storage.local.set(JSON.parse("{\"" + obj_name + "_strg\":\"" + String(document.getElementById(obj_name).value) + "\"}"));
}

async function get_strg_txt(obj_name) {
    browser.storage.local.get(obj_name + "_strg").then((a) => {
        document.getElementById(obj_name).value = a[obj_name + "_strg"];
        if (document.getElementById(obj_name).value == "undefined") {
            document.getElementById(obj_name).value = "";
        }
    });
}

const bool_name_array = ["show_dvj", "purple_score", "use_icon", "border", "show_graph", "swap_img", "rmv_nodes"];

get_home_url();
document.getElementById("rtrn_btn").addEventListener("click", () => { history.back(); });

sync_btn2bool("use_theme").then(() => { rtrn_theme_2_normal() });
document.getElementById("use_theme_btn").addEventListener("click", () => { toggle_bool("use_theme"); sync_btn2bool("use_theme"); rtrn_theme_2_normal(); });

for (let i = 0; i < bool_name_array.length; i++) {
    sync_btn2bool(bool_name_array[i]);
    document.getElementById(bool_name_array[i] + "_btn").addEventListener("click", () => { toggle_bool(bool_name_array[i]); sync_btn2bool(bool_name_array[i]) });
}

get_clr_val("navbar_color");
document.getElementById("navbar_color_btn").addEventListener("input", () => { set_clr_val("navbar_color"); get_clr_val("navbar_color") });

get_clr_val("bg_color");
document.getElementById("bg_color_btn").addEventListener("input", () => { set_clr_val("bg_color"); get_clr_val("bg_color"); });

get_clr_val("bg2_color");
document.getElementById("bg2_color_btn").addEventListener("input", () => { set_clr_val("bg2_color"); get_clr_val("bg2_color"); });

get_strg_txt("swap_img_txt");
document.getElementById("swap_img_txt").addEventListener("input", () => { set_strg_txt("swap_img_txt") });

get_strg_txt("rmv_nodes_txt");
document.getElementById("rmv_nodes_txt").addEventListener("input", () => { set_strg_txt("rmv_nodes_txt") });

