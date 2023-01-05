"use strict"

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
                    break;
                case "bg_color":
                    document.body.style.cssText = "background:" + a[obj_name] + ";";
                    break;
            }
        }
    });
}

//clean this up or smtng
get_home_url();
document.getElementById("rtrn_btn").addEventListener("click", () => { history.back(); });

sync_btn2bool("show_dvj");
document.getElementById("show_dvj_btn").addEventListener("click", () => { toggle_bool("show_dvj"); sync_btn2bool("show_dvj") });

sync_btn2bool("purple_score");
document.getElementById("purple_score_btn").addEventListener("click", () => { toggle_bool("purple_score"); sync_btn2bool("purple_score") });

get_clr_val("navbar_color");
document.getElementById("navbar_color_btn").addEventListener("input", () => { set_clr_val("navbar_color"); get_clr_val("navbar_color") });

get_clr_val("bg_color");
document.getElementById("bg_color_btn").addEventListener("input", () => { set_clr_val("bg_color"); get_clr_val("bg_color") });

get_clr_val("font_color");
document.getElementById("font_color_btn").addEventListener("input", () => { set_clr_val("font_color"); get_clr_val("font_color") });



