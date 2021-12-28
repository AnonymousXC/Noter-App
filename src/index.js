const { app, BrowserWindow, Menu , dialog, shell, ipcMain, globalShortcut} = require('electron');
const path = require('path');


let win, file_path, save_path, mark_color = "blue";

function createWindow() {
    win = new BrowserWindow({
        height: 400,
        width: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
        //icon: path.join(__dirname, "../images/icon.png"),
        //title: 'My App',
    });

    win.setTitle('My App');
    win.loadFile(path.join(__dirname , "../src/styles/main.html"))
    win.webContents.openDevTools();
    win.webContents.on("context-menu" , () => {
        context_menu.popup();
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


var options = {
    silent: false,
    printBackground: true,
    color: false,
    margin: {
        marginType: 'printableArea'
    },
    landscape: false,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
    header: 'Header of the Page',
    footer: 'Footer of the Page'
}



const menu_temp = [
    {
        label: "File",
        submenu: [
        {
            label:"New",
            click: () => {
                win.webContents.send("new_file" , "New File")
            },
            accelerator: "Ctrl + N"
        },
        {
            label: 'New Window',
            click: () => {
                createWindow();
            },
            accelerator:"Ctrl + Shift + N"
        },
        {
            label: "Open...",
            click: () => {
                file_path = dialog.showOpenDialogSync(win, {
                    properties: ['openFile']
                });
                try{
                if(file_path)
                    save_path = file_path[0]
                    win.webContents.send("open_file" , file_path[0]);
                }
                catch(err){}
            },
            accelerator: "Ctrl + O"
        },
        {
            label: "Save",
            click: () => {
                // if(file_path)
                //     save_path = file_path[0]
                if(!save_path)
                    save_path = dialog.showSaveDialogSync(win, {
                    properties: ['saveFile']
                });
                win.webContents.send("save_file" , save_path);
            },
            accelerator: "Ctrl + S"
        },
        {
            label: "Save As",
            click: () => {
                // if(file_path)
                //     save_path = file_path
                save_path = dialog.showSaveDialogSync(win, {
                properties: ['saveFile']
                });
                win.webContents.send("save_file" , save_path);
            },
            accelerator: "Ctrl + Shift + S"
        },
        {
            type: "separator",
        },
        {
            label: "Print Setup",
            click: () => {
                win.webContents.print(options);
            },
            accelerator: "Ctrl + Shift + P"
        },
        {
            label: "Print...",
            click: () => {
                win.webContents.print(options)
            },
            accelerator: "Ctrl + P"
        },
        {
            type: 'separator',
        },
        {
            role:"close",
        }
        ],
    },
    {
        label: 'Edit',
        submenu: [
            {
                role: 'undo',
            },
            {
                role: 'redo',
            },
            {
                type: 'separator',
            },
            {
                role: 'cut',
            },
            {
                role: 'copy',
            },
            {
                role: 'paste',
            },
            {
                role: 'delete',
            },
            {
                type: "separator",
            },
            {
                label: "Search With Google",
                click: () => {
                    win.webContents.send("search_google", null);
                },
                accelerator: "Ctrl + E",
            },
            // {
            //     label: "Find",
            //     click: () => {
            //         const findwindow = new BrowserWindow({
            //             height: 200,
            //             width: 300,
            //             webPreferences: {
            //                 nodeIntegration: true,
            //                 enableRemoteModule: true,
            //                 contextIsolation: false,
            //             },
            //             // icon: path.join(__dirname, 'assets', 'img', 'icon.png'),
            //             // title: 'My App',
            //         });
            //         findwindow.removeMenu();
            //         findwindow.setTitle('Find...');
            //         findwindow.loadFile(path.join(__dirname, '../find/find.html'));
            //         ipcMain.on("search" , (event, txt) => {
            //             win.webContents.send("find" , txt)
            //         })
            //     },
            //     accelerator: "Ctrl + F",
            // },
            {
                type: "separator",
            },
            {
                label: "Select All",
                click: () => {
                    win.webContents.send("select_all" , null);
                },
                accelerator: "Ctrl + A",
            },
            {
                label: "Date/Time",
                click: () => {
                    win.webContents.send("date_time" , null);
                },
                accelerator: "F5",
            }
        ],
    },
    {
        label: "Format",
        submenu: [
            {
                label: "Font",
                click: () => {
                    const fontWindow = new BrowserWindow({
                        height: 400,
                        width: 400,
                        webPreferences: {
                            nodeIntegration: true,
                            enableRemoteModule: true,
                            contextIsolation: false,
                        },
                        // icon: path.join(__dirname, 'assets', 'img', 'icon.png'),
                        // title: 'My App',
                    });
                    // fontWindow.setTitle('My App');
                    fontWindow.webContents.openDevTools();
                    fontWindow.removeMenu();
                    fontWindow.loadFile(path.join(__dirname, '../font/font.html'));
                    ipcMain.on("change_font" , (event, data) => {
                        win.webContents.send("change_font_to" , data);
                    })
                }
            },
            {
                label: "Word Warp",
                type: "checkbox",
                click: () => {
                    win.webContents.send("word_wrap" , null);
                }
            },
        ]
    },
    {
        label: "View",
        submenu: [
            {
                label: "Zoom",
                submenu: [
                    {
                        role: "zoomin",
                    },
                    {
                        role: "zoomout"
                    },
                    {
                        role: "resetzoom",
                    }
                ]
            },
            {
                label: "Status Bar",
                type: "checkbox",
                checked: true,
                click: () => {
                    win.webContents.send("toogle_status_bar" , null)
                }
            }
        ]
    },
    {
        label: "Help",
        submenu: [
            {
                label: "View Help",
                click: () => {
                    shell.openExternal("https://google.com")
                }
            },
            {
                label: "Send Feedback",
            },
            {
                type: "separator",
            },
            {
                label: "About Notepad",
                click: () => {
                    const aboutwindow = new BrowserWindow({
                        height: 400,
                        width: 600,
                        webPreferences: {
                            nodeIntegration: true,
                            enableRemoteModule: true
                        },
                        // icon: path.join(__dirname, 'assets', 'img', 'icon.png'),
                        // title: 'My App',
                    });
                    aboutwindow.removeMenu();
                    aboutwindow.setTitle('About Notepad');
                    aboutwindow.loadFile(path.join(__dirname, '../about/aboutmain.html'));
                }
            }
        ]
    }
]


const context_template = [
    {
        role: "undo",
        accelerator: "Ctrl + Z",
    },
    {
        role: "redo",
        accelerator: "Ctrl + Y",
    },
    {
        type: "separator",
    },
    {
        role: "cut",
        accelerator: "Ctrl + X",
    },
    {
        role: "copy",
        accelerator: "Ctrl + C",
    },
    {
        role: "paste",
        accelerator: "Ctrl + V",
    },
    {
        role: "delete",
    },
    {
        type: "separator",
    },
    {
        role: "selectall",
        accelerator: "Ctrl + A",
    },
    {
        label: "Search Online",
        click: () => {
            win.webContents.send("search_google" , null);
        },
        accelerator: "Ctrl + E",
    },
    {
        type: "separator",
    },
    {
        role: "zoomin",
        accelerator: "Ctrl + Plus",
    },
    {
        role: "zoomout",
        accelerator: "Ctrl + -",
    },
    {
        role: "resetzoom",
        accelerator: "Ctrl + 0",
    },
    {
        type: "separator",
    },
    // {
    //     label: "Mark All",
    //     accelerator: "Ctrl + M",
    //     click: () => {
    //         win.webContents.send("mark_sel" , null);
    //     },
    // },
    // {
    //     label: "Mark Color",
    //     submenu: [
    //         {
    //             label: "Red",
    //             click: () => {
    //                 mark_color = "red";
    //                 win.webContents.send("change_mark_color" , mark_color);
    //             },
    //         },
    //         {
    //             label: "Blue",
    //             click: () => {
    //                 mark_color = "blue";
    //                 win.webContents.send("change_mark_color" , mark_color);
    //             },
    //         },
    //         {
    //             label: "Green",
    //             click: () => {
    //                 mark_color = "green";
    //                 win.webContents.send("change_mark_color" , mark_color);
    //             },
    //         },
    //         {
    //             label: "Yellow",
    //             click: () => {
    //                 mark_color = "yellow";
    //                 win.webContents.send("change_mark_color" , mark_color);
    //             },
    //         },
    //     ],
    // },
    {
        label: "Unmark All",
        click: () => {
            win.webContents.send("unmark" , null);
        },
        accelerator: "Ctrl + U",
    },
];


//Menus####################
const menu = Menu.buildFromTemplate(menu_temp);
Menu.setApplicationMenu(menu);
const context_menu = Menu.buildFromTemplate(context_template);



// ShortCuts################
app.whenReady().then(() => {

    globalShortcut.register("CommandOrControl+M" , () => {
    win.webContents.send("mark_sel" , null);
    });

    globalShortcut.register("CommandOrControl+U" , () => {
        win.webContents.send("unmark" ,null);
    });

    globalShortcut.register("CommandOrControl+E" , () => {
        win.webContents.send("search_google", null);
    });

    }
);