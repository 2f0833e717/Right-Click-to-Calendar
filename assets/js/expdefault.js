"use strict";

/**
 * デフォルトの判定メソッド
 * オプションで正規表現編集が指定されていない場合
 * もしくは、正規表現にマッチしなかった場合に使用される
 */
const expDefault = (stext) => {

    // 年月日の初期設定
    let d = new Date();

    let smon = d.getMonth() + 1;
    let sday = d.getDate();
    let syear = d.getFullYear();

    let emon = d.getMonth() + 1;
    let eday = d.getDate();
    let eyear = d.getFullYear();

    let shour = d.getHours();
    let smin = d.getMinutes();

    let ehour = d.getHours();
    let emin = d.getMinutes();

    let title = stext;

    let matched = false;

    let mm = stext.match(/(\d{2,4})(\/|年)(\d{1,2})(\/|月)(\d{1,2})/); // 開始年日付
    if (mm) {
        syear = parseInt(mm[1], 10);
        if (syear < 2000) {
            syear += 2000;
        }
        smon = mm[3];
        sday = mm[5];
        matched = true;
    } else {
        let m = stext.match(/(\d{1,2})(\/|月)(\d{1,2})/); // 開始日付
        if (m) {
            smon = m[1];
            sday = m[3];
            matched = true;
        }
    }

    let em = stext.match(/\d{1,2}(\/|月)\d{1,2}(?!\/|\d)[\s\S]*(\d{2,4})(\/|年)(\d{1,2})(\/|月)(\d{1,2})(?!\/|\d)/); // 終了日付
    if (em) {
        eyear = em[2];
        eyear = parseInt(eyear, 10);
        if (eyear < 2000) {
            eyear += 2000;
        }
        emon = em[4];
        eday = em[6];
        matched = true;
    } else {
        let emm = stext.match(/\d{1,2}(\/|月)\d{1,2}(?!\/|\d)[\s\S]*(\d{2})(\/|月)(\d{1,2})(?!\/|\d)/) ||
            stext.match(/\d{1,2}(\/|月)\d{1,2}(?!\/|\d)[\s\S]*(\d{1})(\/|月)(\d{1,2})(?!\/|\d)/);
        if (emm) {
            emon = emm[2];
            eday = emm[4];
            matched = true;
        } else {
            eyear = syear;
            emon = smon;
            eday = sday;
        }
    }

    let rr = stext.match(/(\d{1,2})(:|時)(\d{1,2}|)/); // 開始時刻
    if (rr) {
        shour = rr[1];
        let checkPm = stext.match(/(午前|AM|午後|PM)/);
        if (checkPm && (checkPm[0] === "午後" || checkPm[0] === "PM")) {
            shour = parseInt(shour, 10);
            if (shour < 12) {
                shour += 12;
            }
        }
        smin = rr[4] || 0;
        matched = true;
    }

    let er = stext.match(/\d{1,2}(:|時)([\s\S]*)(\d{2})(:|時)(\d{1,2}|)/) ||
        stext.match(/\d{1,2}(:|時)([\s\S]*)(\d{1})(:|時)(\d{1,2}|)/); // 終了時刻
    if (er) {
        ehour = er[3];
        if (er[2].match(/(午後|PM)/)) {
            ehour = parseInt(ehour, 10);
            if (ehour < 12) {
                ehour += 12;
            }
        }
        emin = er[5] || 0;
        matched = true;
    } else {
        ehour = shour;
        emin = smin;
    }

    let t = stext.match(/(\n|\s)(\D{1,2}\S+)(\n|$)/); // タイトル
    if (t && matched) {
        title = t[2];
    }

    let location = "";
    let l = stext.match(/場所(\S?\n|\S?|\s?)(\S+)($|\n)/); // 場所
    if (l) {
        location = l[2];
    }

    smon = ((parseInt(smon, 10) - 1) > -1) ? (parseInt(smon, 10) - 1) : smon;
    emon = ((parseInt(emon, 10) - 1) > -1) ? (parseInt(emon, 10) - 1) : emon;
    let args = {
        "start": {
            "year": syear,
            "month": smon,
            "day": sday,
            "hour": shour,
            "min": smin,
        },
        "end": {
            "year": eyear,
            "month": emon,
            "day": eday,
            "hour": ehour,
            "min": emin,
        },
        "title": title,
        "detail": "",
        "location": location,
        "selected_text": stext
    };

    return args;
};