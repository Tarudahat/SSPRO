"use strict"

var home_url;

document.getElementById("exit_btn").href=home_url+"/logout";
document.getElementsByTagName("style")[0].innerHTML.replace("=1=",home_url+"/smsc/svg/exit_ic_white/exit_ic_white_24x24.svg"); 

document.getElementById("rtrn_btn").addEventListener("click",()=>{history.back()});