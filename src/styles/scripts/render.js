const fs = require('fs');
const {ipcRenderer, shell} = require('electron');
// const Mark = require('mark.js');




function new_file() {
    document.getElementById("textbox").textContent = "";
}


function open_file(filepath) {
    try{
        const txt = fs.readFileSync(filepath, {encoding:'utf-8'});
        document.getElementById("textbox").innerText = txt;
        document.getElementById("title").textContent = filepath + " -Noter!";
    }
    catch(err){
        window.alert(err);
    };
}


function save_file(savepath) {
    try{
        const txt = document.getElementById("textbox").innerText;
        fs.writeFileSync(savepath,txt);
        document.getElementById("title").textContent = savepath + " -Noter!";
    }
    catch(err){
        window.alert(err);
    }
}


function search_goog() {
    const selected_txt = document.getSelection().toString();
    shell.openExternal("https://www.google.com/search?q=" + selected_txt);
}


// function find(text_find) {
//     const text = document.getElementById("textbox");
//     var marker = new Mark(text);
//     marker.mark(text_find);
// }


// function unmark() {
//     var marker = new Mark(document.getElementById("textbox"));
//     marker.unmark()
// }


function date_time() {
    const current = new Date();
    const tt_dd = " " + current.getHours() + ":" + current.getMinutes() + " Hours " + current.getDate() + "/" + current.getMonth() + "/" + current.getFullYear() + " ";
    const txt = document.getElementById("textbox").textContent;
    const final_txt = txt + tt_dd;
    document.getElementById("textbox").textContent = final_txt;
}


ipcRenderer.on("new_file" , (event, ms) => {
    new_file();
});


ipcRenderer.on("open_file" , (event, file_path) => {
    open_file(file_path);
})

ipcRenderer.on('save_file', (event, arg) => {
    save_file(arg);
});

ipcRenderer.on('search_google', (event) => {
    search_goog();
});


// ipcRenderer.on("find" , (event, msg) => {
//     find(msg);
// });


ipcRenderer.on("select_all" , (event) => {
    window.getSelection().selectAllChildren(document.getElementById("textbox"));
});


ipcRenderer.on("date_time" , (event) => {
    date_time();
});


ipcRenderer.on("word_wrap" , (event) => {
    const doc = document.getElementById("textbox");
    console.log(doc.style.wordBreak);
});


// ipcRenderer.on("mark_sel", () => {
//     const text = document.getSelection().toString();
//     find(text);
// });


// ipcRenderer.on("unmark" , (event) => {
//     unmark();
// });


// ipcRenderer.on("change_mark_color" , (event , color) => {
//     try{
//         document.querySelector("mark").style.background = color;
//         document.querySelector("mark").style.color = "black";
//     }
//     catch(err){
//         console.log(err);
//     };
// });


ipcRenderer.on("toogle_status_bar" , (event) => {
    const status_bar = document.getElementById("status-bar");
    const style = window.getComputedStyle(status_bar);
    const visibilty = style.getPropertyValue("visibility");
    if(visibilty == "hidden"){
        document.getElementById("status-bar").style.visibility = "visible";
        document.getElementById("textbox").style.height = "97vh";
    }
    else {
        document.getElementById("status-bar").style.visibility = "hidden";
        document.getElementById("textbox").style.height = "100vh";
    }
});



ipcRenderer.on("change_font_to" , (event, data) => {
    document.body.style.fontFamily = data[0];
    document.body.style.fontSize = data[1] + 'px';
    console.log(data);

    if(data[2] == "normal" || data[2] == "italic" || data[2] == "oblique"){
        document.body.style.fontWeight = "normal";
        document.body.style.fontStyle = data[2];
    }
    else if(data[2] == "Bold")
        document.body.style.fontWeight = data[2];
    else if(data[2] == "Italic and Bold"){
        document.body.style.fontWeight = "bold";
        document.body.style.fontStyle = "italic";
    }

})