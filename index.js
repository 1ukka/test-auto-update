const { app, BrowserWindow, autoUpdater, ipcMain } = require("electron");
const path = require("path");
const log = require("electron-log");

// Configure logging
log.transports.file.level = "info";
autoUpdater.logger = log;

// Set update URL for autoUpdater
autoUpdater.setFeedURL({
  url: `https://github.com/1ukka/test-auto-update`,
  // provider: 'github',
  // repo: 'test-auto-update',
  // owner: '1ukka',
  private: false,
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

  win.loadFile("index.html");

  win.once("ready-to-show", () => {
    splash.close();
    win.show();
  });

  win.on("closed", function () {
    win = null;
    app.quit();
  });
  autoUpdater.checkForUpdates();

  autoUpdater.on("update-available", () => {
    log.info("Update available.");
    win.webContents.send("update-available");
  });

  autoUpdater.on("update-downloaded", () => {
    log.info("Update downloaded; will install in 5 seconds");
    win.webContents.send("update-downloaded");
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 5000);
  });

  autoUpdater.on("error", (err) => {
    log.error("Error in auto-updater: " + err);
    win.webContents.send("update-error", err);
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
