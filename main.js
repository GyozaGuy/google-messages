const {app, BrowserWindow, Menu, Tray} = require('electron');
require('electron-reload')(__dirname);

let win;

function createTray() {
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', click: () => app.quit()}
  ]);
  const tray = new Tray(__dirname + '/img/appicon-tray.png');

  tray.setToolTip('Messages');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (!win) {
      createWindow();
    } else if (win.isVisible()) {
      if (win.isFocused()) {
        win.hide();
      } else {
        win.focus();
      }
    } else {
      win.show();
    }
  });

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });
}

function createWindow(cb) {
  win = new BrowserWindow({height: 700, show: false, width: 1000});

  win.loadURL('https://messages.android.com');

  win.once('ready-to-show', () => {
    win.show();

    if (cb && typeof cb === 'function') {
      cb();
    }
  });

  win.on('close', () => {
    // e.preventDefault();
    // win.hide();
    win = null;
  });

  // win.openDevTools();
}

app.on('activate', () => {
  if (!win) {
    createWindow();
  } else {
    win.show();
  }
});

app.on('ready', () => {
  createWindow(() => {
    if (process.platform !== 'darwin') {
      createTray();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
