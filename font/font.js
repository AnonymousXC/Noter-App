const {ipcRenderer} = require('electron');


function get_settings() {
    const font = document.getElementById("font-sel").value;
    const size = document.getElementById("size").value;
    const font_style = document.getElementById("font-sty").value;
    const data = [];
    data.push(font);
    data.push(size);
    data.push(font_style);
    ipcRenderer.send("change_font" , data);
}


