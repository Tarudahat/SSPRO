"use strict"

async function get_home_url(){
    var a;
    var home_url;
    await browser.storage.local.get("sspro_home_url").then((a)=>{home_url=a.sspro_home_url;});
    document.getElementById("exit_btn").href=home_url+"/logout";
}

async function sync_btn2bool(bool_name)
{
    var btn_classlist = document.getElementById(bool_name+"_btn").classList;
    var show_bool;
    await browser.storage.local.get(bool_name).then((show_bool)=>{
        if(show_bool[bool_name]){
            if (btn_classlist.contains("off")){btn_classlist.remove("off");}
        }else{
            btn_classlist.add("off");
        };
    });
}

async function toggle_bool(bool_name)
{
    var btn_classlist = document.getElementById(bool_name+"_btn").classList;
    btn_classlist.toggle("off")
    if (btn_classlist.contains("off"))
    {
        browser.storage.local.set(JSON.parse("{\""+bool_name+"\":false}"));
    }else
    {
        browser.storage.local.set(JSON.parse("{\""+bool_name+"\":true}"));
    }
}

get_home_url();
document.getElementsByTagName("style")[0].innerHTML=document.getElementsByTagName("style")[0].innerHTML.replace("=1=","https://static6.smart-school.net/smsc/svg/exit_ic_white/exit_ic_white_24x24.svg");
document.getElementById("rtrn_btn").addEventListener("click",()=>{history.back()});

sync_btn2bool("show_dvj");
document.getElementById("show_dvj_btn").addEventListener("click",()=>{toggle_bool("show_dvj");sync_btn2bool("show_dvj")});

sync_btn2bool("purple_score");
document.getElementById("purple_score_btn").addEventListener("click",()=>{toggle_bool("purple_score");sync_btn2bool("purple_score")});


