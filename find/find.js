const {ipcRenderer} = require('electron');


function give_data() {
    const text = document.getElementById("txttos").value
    ipcRenderer.send("search" , text);
}