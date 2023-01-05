"use strict"

async function check_ppl_bool() {
    let show_bool = false;
    let rtrn_bool = false;
    await browser.storage.local.get("purple_score").then((show_bool) => { rtrn_bool = show_bool.purple_score });
    return rtrn_bool;
}

function scrape_pplscore_nodes() {
    let prg_list = document.getElementsByClassName("progress-ring__content");

    for (let i = 0; i < prg_list.length; i++) {
        let scraped_score = Number(prg_list[i].innerText.split("%")[0]);
        if (isNaN(scraped_score)) {
            if (Number(prg_list[i].innerText.split("\n")[1].split("%")[0]) >= 95) {
                let score_block = prg_list[i].parentNode.parentNode;
                score_block.className = score_block.className.replace("-blue-combo--", "-purple-combo--");
                score_block.getElementsByTagName("circle")[0].style.cssText = score_block.getElementsByTagName("circle")[0].style.cssText.replace("blue", "purple");
                score_block.getElementsByTagName("circle")[1].style.cssText = score_block.getElementsByTagName("circle")[1].style.cssText.replace("blue", "purple");
            }
        } else if (scraped_score >= 95) {
            let score_block = prg_list[i].parentNode.parentNode.parentNode;
            if (score_block.classList.contains("c-blue-combo--100")) {
                score_block.className = score_block.className.replace("-blue-combo--", "-purple-combo--");
                score_block.getElementsByTagName("circle")[0].style.cssText = score_block.getElementsByTagName("circle")[0].style.cssText.replace("blue", "purple");
                score_block.getElementsByTagName("circle")[1].style.cssText = score_block.getElementsByTagName("circle")[1].style.cssText.replace("blue", "purple");
                if (score_block.contains(score_block.getElementsByClassName("smsc-svg--message_feedback_blue--16")[0])) {
                    score_block.getElementsByClassName("smsc-svg--message_feedback_blue--16")[0].className = score_block.getElementsByClassName("smsc-svg--message_feedback_blue--16")[0].className.replace("blue", "purple");
                };
            }
            if (score_block.classList.contains("selected")) { score_block.className = score_block.className.replace("-1", "-2"); } else { score_block.className = score_block.className.replace("-2", "-1"); };
        }
    }

    prg_list = document.getElementsByClassName("graphic__text");
    for (let i = 0; i < prg_list.length; i++) {
        let scraped_score = (Number(prg_list[i].title.replace(",", ".").split("/")[0]) / Number(prg_list[i].title.replace(",", ".").split("/")[1])) * 100;
        if (scraped_score >= 95) {
            let score_block = prg_list[i].parentNode.parentNode.parentNode;
            score_block.className = score_block.className.replace("-blue-combo--", "-purple-combo--");
            score_block.style.cssText = score_block.style.cssText.replace("blue", "purple");
        }
    }

}

check_ppl_bool().then((use_ppl) => { if (document.contains(document.getElementsByClassName("results")[0]) && use_ppl) { setInterval(scrape_pplscore_nodes, 80); }; });
