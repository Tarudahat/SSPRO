"use strict"

async function get_home_url(){
    var a;
    var home_url;
    await browser.storage.local.get("sspro_home_url").then((a)=>{home_url=a.sspro_home_url;});
    document.getElementById("exit_btn").href=home_url+"/logout";
}

get_home_url();
document.getElementsByTagName("style")[0].innerHTML=document.getElementsByTagName("style")[0].innerHTML.replace("=1=","https://static6.smart-school.net/smsc/svg/exit_ic_white/exit_ic_white_24x24.svg");
document.getElementById("rtrn_btn").addEventListener("click",()=>{history.back()});