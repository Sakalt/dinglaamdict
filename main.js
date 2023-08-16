"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const typeColors = {
    "名": { bg: "#ffeeee", br: "#ff9090" },
    "代名": { bg: "#ffeeee", br: "#ff9090" },
    "動": { bg: "#fff0ee", br: "#ffbb90" },
    "形": { bg: "#e7ffdc", br: "#9bed5c" },
    "副": { bg: "#d3ffd9", br: "#4ed264" },
    "助": { bg: "#d3fff8", br: "#58edcd" },
    "助動": { bg: "#d7edff", br: "#5099e8" },
    "感": { bg: "#ffddfc", br: "#ec71d5" },
    "接": { bg: "#eaeaea", br: "#909090" },
    "数": { bg: "#f5d9ff", br: "#b663e7" },
    "前置": { bg: "#e6dece", br: "#a27b3b" },
};
let presentPage = 1;
const wordInOnePage = 30;
let prevButton;
let nextButton;
let firstButton;
let lastButton;
let searchBox;
let searchButton;
let searchTypeList;
// XMLHttpRequestを使ってjsonデータを読み込む
let requestURL = './dict/dict.json'; //jsonへのパス
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
// JSONデータをJavaScriptオブジェクトに変換
request.onload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let data = request.response;
        data = JSON.parse(JSON.stringify(data));
        writeDict(data, presentPage);
    });
};
function writeDict(dict, page, filter = "", type = "word") {
    dict.sort((a, b) => {
        if (a.word > b.word) {
            return 1;
        }
        else if (a.word < b.word) {
            return -1;
        }
        else {
            return 0;
        }
    });
    const filtedWords = dict.filter((w) => {
        if (type == "mean") {
            console.log(type);
            const isMeanIncludes = w["mean"].some((m) => {
                return m["explanation"].includes(filter);
            });
            const isAppendIncludes = w["append"].some((a) => {
                return a["explanation"].includes(filter);
            });
            return isMeanIncludes || isAppendIncludes;
        }
        return w[type].includes(filter); //mean以外の時はこっち
    });
    const totalPages = Math.ceil(filtedWords.length / wordInOnePage);
    const dictInPage = filtedWords.filter((a, idx) => {
        return Math.floor(idx / wordInOnePage) + 1 == page;
    });
    const contentBox = document.getElementById("contentbox");
    let dictHTML = "";
    dictInPage.forEach((w) => {
        let meanHTML = "";
        w.mean.forEach((m) => {
            const type = m.partOfSpeech; //品詞
            meanHTML += `
            <div class="speech">
                <span class="type" style="border-color:${typeColors[type].br}; background-color:${typeColors[type].bg};">${type}</span>
                <span class="text">${m.explanation}</span>
            </div>
            `;
        });
        let appendHTML = "";
        if (w.append[0].type != "") {
            appendHTML += '<div class="mean">';
            w.append.forEach((a) => {
                appendHTML += `
                <div class="speech">
                    <span class="apptype">${a.type}</span>
                    <span class="text">${a.explanation}</span>
                </div>
                `;
            });
            appendHTML += '</div>';
        }
        let wordHTML = `
        <div class="content">
            <div class="word">
                <span class="phun">【${w.word}】</span>
                <span class="trans">${w.word}</span>
                <span class="pron">/${w.pron}/</span>
            </div>
            <div class="mean">
                ${meanHTML}
            </div>
            ${appendHTML}
        </div>
        `;
        dictHTML += wordHTML;
    });
    contentBox.innerHTML = dictHTML;
    const buttons = document.getElementById("pagebuttons");
    const viewPrev = presentPage > 1 ? "" : " class='hidebutton'";
    const viewNext = presentPage < totalPages ? "" : " class='hidebutton'";
    buttons.innerHTML = `
    <button type="button"${viewPrev} id="first">最初のページへ</button>
    <button type="button"${viewPrev} id="prev">前のページへ</button>
    <p>${presentPage}/${totalPages}</p>
    <button type="button"${viewNext} id="next">次のページへ</button>
    <button type="button"${viewNext} id="last">最後のページへ</button>
    `;
    prevButton = document.getElementById("prev");
    nextButton = document.getElementById("next");
    firstButton = document.getElementById("first");
    lastButton = document.getElementById("last");
    searchBox = document.getElementById("input");
    searchButton = document.getElementById("search");
    prevButton.addEventListener("click", () => {
        presentPage--;
        writeDict(dict, presentPage, filter, type);
        moveBottom();
    });
    nextButton.addEventListener("click", () => {
        presentPage++;
        writeDict(dict, presentPage, filter, type);
        moveBottom();
    });
    firstButton.addEventListener("click", () => {
        presentPage = 1;
        writeDict(dict, presentPage, filter, type);
        moveBottom();
    });
    lastButton.addEventListener("click", () => {
        presentPage = totalPages;
        writeDict(dict, presentPage, filter, type);
        moveBottom();
    });
    searchButton.addEventListener("click", () => {
        searchTypeList = document.getElementsByName("searchtype");
        let searchType;
        searchTypeList.forEach((a, idx) => {
            if (searchTypeList.item(idx).checked) {
                searchType = searchTypeList.item(idx).value;
            }
        });
        const text = searchBox.value;
        presentPage = 1;
        writeDict(dict, presentPage, text, searchType);
    });
}
function moveBottom() {
    /*
    const a = document.documentElement;
    const y = a.scrollHeight - a.clientHeight;
    window.scroll(0, y);
    */
    window.scroll({ top: 0 });
}
