const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require('path');
const log = require('electron-log');

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;

// Set update URL for autoUpdater
autoUpdater.setFeedURL({
  provider: 'github',
  repo: 'test-auto-update',
  owner: '1ukka',
  private: false
});

let win;
let splash;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      allowRendererProcessReuse: false,
    },
    autoHideMenuBar: true,
    width: 1300,
    height: 800,
    show: false,
  });

  splash = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false,
      allowRendererProcessReuse: false,
      nativeWindowOpen: true,
    },
    autoHideMenuBar: true,
    width: 500,
    height: 500,
    minWidth: 500,
    minHeight: 500,
    show: true,
    frame: false,
  });

  win.loadFile('index.html');
  
  win.once("ready-to-show", () => {
    splash.close();
    win.show();
  });

  win.on("closed", function () {
    win = null;
    app.quit();
  });

  // Initialize auto-updater
  autoUpdater.checkForUpdatesAndNotify();
  
  autoUpdater.on('update-available', () => {
    log.info('Update available.');
  });

  autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded; will install in 5 seconds');
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 5000);
  });

  autoUpdater.on('error', (err) => {
    log.error('Error in auto-updater. ' + err);
  });
}

app.on("ready", createWindow);
app.on("window-all-closed", function () {
  app.quit();
});

app.on("activate", function () {
  if (win === null) {
    createWindow();
  }
});

app.whenReady(() => {
  app.allowRendererProcessReuse = false;
});
