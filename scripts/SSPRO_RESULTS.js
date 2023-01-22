"use strict"

var using_grph_mode = false;

//forgive me father for I have written not so object orientated code in js 
var scraped_score_list = [];
var course_names_array = [[]];
var title_nodes_array = [];
var grph_cnvs = [];

async function check_bool(bool_name) {
    let rtrn_bool = false;
    await browser.storage.local.get(bool_name).then((show_bool) => { rtrn_bool = show_bool[bool_name] });
    return rtrn_bool;
}

//what js has nice objects? Well those are overrated not gonna lie...
function scrape_score_data() {
    let row_list = document.getElementsByClassName("row");
    let course_name_array_index = 0;
    let course_name = "";
    scraped_score_list = [];
    course_names_array = [[]];
    title_nodes_array = [];
    grph_cnvs = [];
    if (row_list) {
        let table_score_data = [];
        for (let i = 0; i < row_list.length; i++) {
            if (!row_list[i].classList.contains("row--class")) {

                if (row_list[i].getElementsByClassName("cell__course-name")) {
                    course_name = row_list[i].getElementsByClassName("cell__course-name")[0].innerText.replace(" ", "_");
                }
                if (!(course_name == "Algemeen_totaal")) {
                    if (!course_names_array[course_name_array_index].includes(course_name)) {
                        table_score_data.push([]);
                        course_names_array[course_name_array_index].push(course_name);
                    }

                    let evaluation_array = row_list[i].getElementsByClassName("cell--evaluation");
                    for (let i2 = 0; i2 < evaluation_array.length; i2++) {
                        if (evaluation_array[i2].getElementsByClassName("graphic__text")[0]) {
                            let raw_score_string = evaluation_array[i2].getElementsByClassName("graphic__text")[0].title;
                            let detail_id = evaluation_array[i2].getElementsByTagName("button")[0].getAttribute("evaluation-identifier");
                            table_score_data[course_names_array[course_name_array_index].indexOf(course_name)].push([Math.round((Number(raw_score_string.replace(",", ".").split("/")[0]) / Number(raw_score_string.replace(",", ".").split("/")[1])) * 100), detail_id]);
                        }
                    }
                }

            } else {
                title_nodes_array.push(row_list[i].getElementsByClassName("cell__title")[0]);
                scraped_score_list.push(table_score_data);
                table_score_data = [];
                course_names_array.push([]);
                course_name_array_index++;
            }

        }
        scraped_score_list.push(table_score_data);
        if (scraped_score_list[0].length == 0) { scraped_score_list.shift(); }
    }
}



function draw_graph() {
    //replace tables with graphs
    let temp_canvas;
    for (let i = 0; i < scraped_score_list.length; i++) {
        if (document.getElementById("SSPRO_graph_canvas_" + String(i))) {
            temp_canvas = document.getElementById("SSPRO_graph_canvas_" + String(i));

            if (temp_canvas.added_btns == false) {
                //r->255 || g->255 || r->0 || b->255 || g->0
                let btn_div = document.createElement("div");

                for (let i2 = 0; i2 < course_names_array[i].length; i2++) {
                    let vak_btn = document.createElement("button");
                    vak_btn.classList.add("option_btn");
                    vak_btn.innerText = course_names_array[i][i2].replace("_", " ");
                    vak_btn.title = vak_btn.innerText;
                    vak_btn.id = String(i) + "_" + String(i2);
                    vak_btn.style.cssText = "position: absolute; right: 50px;top:" + String(i2 * 70) + "px;";
                    temp_canvas.after(vak_btn);
                    vak_btn.addEventListener("click", () => { vak_btn.classList.toggle("off"); });
                }
                temp_canvas.added_btns = true;
            }

            if (document.getElementsByClassName("bubble--tooltip")[0]) {
                document.getElementsByClassName("bubble--tooltip")[0].remove();
            }

        } else {
            temp_canvas = document.createElement("canvas");
            temp_canvas.added_btns = false;
        }

        if (!grph_cnvs[i]) {
            grph_cnvs.push(temp_canvas.getContext("2d"));
        }

        temp_canvas.id = "SSPRO_graph_canvas_" + String(i);
        temp_canvas.width = 1100;
        temp_canvas.height = 650;

        //draw graphs:
        //draw canvas bg 
        grph_cnvs[i].fillStyle = "white";
        grph_cnvs[i].fillRect(0, 0, temp_canvas.width, temp_canvas.height);

        //draw indication lines and numbers
        grph_cnvs[i].beginPath();
        grph_cnvs[i].font = "18px Open Sans";
        grph_cnvs[i].fillStyle = "#c5c5c5";
        grph_cnvs[i].lineWidth = 1;
        grph_cnvs[i].strokeStyle = "#c5c5c5";

        for (let i2 = 0; i2 < 11; i2++) {
            grph_cnvs[i].fillText(String(100 - i2 * 10), 30, 54 * (i2 + 1) + 5);
            grph_cnvs[i].moveTo(80, 54 * (i2 + 1));
            grph_cnvs[i].lineTo(1055, 54 * (i2 + 1));
        }

        grph_cnvs[i].stroke();

        //draw score graphs
        for (let i2 = 0; i2 < scraped_score_list[i].length; i2++) {


            for (let i3 = 0; i3 < scraped_score_list[i][i2].length; i3++) {
                if (document.getElementById(String(i) + "_" + String(i2))) {
                    if (!document.getElementById(String(i) + "_" + String(i2)).classList.contains("off")) {
                        grph_cnvs[i].beginPath();
                        grph_cnvs[i].lineCap = "round";
                        grph_cnvs[i].lineWidth = 4;
                        grph_cnvs[i].strokeStyle = "red";
                        grph_cnvs[i].moveTo(82 + (971 / (scraped_score_list[i][i2].length - 1) * i3), 594 - (scraped_score_list[i][i2][i3][0] / 100) * 540);
                        if (i3 < scraped_score_list[i][i2].length - 1) {
                            grph_cnvs[i].lineTo(82 + (971 / (scraped_score_list[i][i2].length - 1) * (i3 + 1)), 594 - (scraped_score_list[i][i2][i3 + 1][0] / 100) * 540);
                        }
                        grph_cnvs[i].stroke();
                    }
                }
            }
        }


        if (document.getElementsByClassName("table-page__container__wrapper")[0]) {
            document.getElementsByClassName("table-page__container__wrapper")[0].parentNode.appendChild(temp_canvas);
            document.getElementsByClassName("table-page__container__wrapper")[0].remove();
        } else if (!document.getElementById("SSPRO_graph_canvas_" + String(i))) {
            document.getElementById("SSPRO_graph_canvas_" + String(i - 1)).after(temp_canvas);
        }

        if (title_nodes_array[i]) {
            temp_canvas.before(title_nodes_array[i]);
        }
        if (title_nodes_array.length == i + 1) {
            title_nodes_array = [];
        }
    }
}

async function handel_graph_page() {
    if (document.getElementsByClassName("btn_icon_graph").length == 0 && document.getElementsByClassName("wide-toolbar__item").length > 0) {

        //add graph btn
        let graph_btn = document.createElement("button");
        graph_btn.classList.add("wide-toolbar__item");
        graph_btn.id = "SSPRO_graph_btn";
        graph_btn.innerHTML = '<div class="wide-toolbar__item__icon btn_icon_graph"></div><span class="wide-toolbar__item__name">Grafiek</span>';

        //set stuff to exit grph md
        graph_btn.onclick = function () {
            window.location.href = window.location.href.split(".be")[0] + ".be" + "/results/main/table";
            browser.storage.local.set({ in_graph_mode: true });
        };

        let third_btn = document.getElementsByClassName("smsc-svg--view_tablegrid--16")[0].parentNode;
        third_btn.after(graph_btn);

        if (!window.location.href.includes("table")) {
            document.getElementById("SSPRO_graph_btn").classList.remove("wide-toolbar__item--selected");
            browser.storage.local.set({ in_graph_mode: false });
            using_grph_mode = false;
        }

        if (using_grph_mode) {

            graph_btn.classList.add("wide-toolbar__item--selected");
            third_btn.onclick = function () { browser.storage.local.set({ in_graph_mode: false }); window.location.href = window.location.href; };
            third_btn.classList.remove("wide-toolbar__item--selected");
        }
    }
    if (using_grph_mode) {
        if (document.getElementsByClassName("title-and-schoolyear-selector__title")[0]) {
            document.getElementsByClassName("title-and-schoolyear-selector__title")[0].innerText = "Grafiek";
        }
        if (document.getElementsByClassName("smsc-svg--view_tablegrid--128")[0]) {
            document.getElementsByClassName("smsc-svg--view_tablegrid--128")[0].classList.replace("smsc-svg--view_tablegrid--128", "btn_icon_graph");
        }
        if (document.getElementsByClassName("graphic__text")[0]) {
            scrape_score_data();
        }
        draw_graph();
    }
}

function apply_purple_scores() {
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

check_bool("purple_score").then((use_ppl) => { if (use_ppl) { setInterval(apply_purple_scores, 80); }; });


check_bool("show_graph").then((show_grph) => {
    if (show_grph) {
        check_bool("in_graph_mode").then((grph_md) => { using_grph_mode = grph_md; });
        setInterval(handel_graph_page, 15);
    }
});