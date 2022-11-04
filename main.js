const { app, BrowserWindow, Menu, shell, Tray } = require('electron');
const windowStateKeeper = require('electron-window-state');
const url = require('url');
require('electron-reload')(__dirname);

let isQuitting = false;
let win;

function createTray() {
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Reload', click: () => win.reload() },
    { label: 'Quit', click: () => app.exit() }
  ]);
  const tray = new Tray(`${__dirname}/img/messages.png`);

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
  const mainWindowState = windowStateKeeper({
    defaultHeight: 700,
    defaultWidth: 1000
  });
  const { height, width } = mainWindowState;

  win = new BrowserWindow({
    height,
    icon: `${__dirname}/img/messages.png`,
    show: false,
    title: 'Google Messages',
    webPreferences: {
      nodeIntegration: false,
      plugins: true
    },
    width
  });

  mainWindowState.manage(win);

  win.loadURL(
    url.format({
      hostname: 'messages.google.com',
      pathname: '/web',
      protocol: 'https:',
      slashes: true
    })
  );

  win.once('ready-to-show', () => {
    win.show();

    if (cb && typeof cb === 'function') {
      cb();
    }
  });

  win.on('close', e => {
    if (!isQuitting) {
      e.preventDefault();
      win.hide();
    } else {
      win = null;
    }
  });

  // win.openDevTools();
}

if (!app.requestSingleInstanceLock()) {
  app.exit();
}

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('ready', () => {
  createWindow(() => {
    Menu.setApplicationMenu(null);

    if (process.platform !== 'darwin') {
      createTray();
    }
  });

  const page = win.webContents;
  const debouncers = [];

  page.on('new-window', (e, url) => {
    e.preventDefault();

    if (!debouncers.includes(url)) {
      debouncers.push(url);
      shell.openExternal(url);

      setTimeout(() => {
        debouncers.splice(debouncers.indexOf(url), 1);
      }, 100);
    }
  });
});

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }

    win.show();
    win.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.exit();
  }
});
