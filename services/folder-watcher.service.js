const chokidar = require("chokidar");
const EventEmitter = require("events").EventEmitter;
const fsExtra = require("fs-extra");

class FolderWatcher extends EventEmitter {
  constructor() {
    super();
  }

  watchFolder(folder) {
    try {
      console.log(
        `[${new Date().toLocaleString()}] Watching for folder changes on: ${folder}`
      );

      const watcher = chokidar.watch(folder, { persistent: true });

      watcher.on("add", (filePath, stats) => {
        this.emit("file-added", {
          path: filePath,
          stats: {
            atime: stats.atime,
            birthtime: stats.birthtime,
            ctime: stats.ctime,
            size: stats.size,
            mode: stats.mode,
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = FolderWatcher;
