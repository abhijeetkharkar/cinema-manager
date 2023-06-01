const { app, BrowserWindow, ipcMain, screen, dialog } = require("electron");
const url = require("url");
const path = require("path");
const serviceInstaller = require("./handlers/service-installation.handler");
const DatabaseHandler = require("./handlers/database.handler");

let mainWindow;

const createWindow = async () => {
  console.log("createWindow called");
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  /* serviceInstaller.installService((status, log) => {
    if (status) {
      mainWindow = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
          nodeIntegration: true,
        },
        icon: "./cinema-manager.ico",
      });

      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, `/dist/index.html`),
          protocol: "file:",
          slashes: true,
        })
      );

      mainWindow.webContents.openDevTools();

      mainWindow.on("closed", () => {
        mainWindow = null;
      });
    } else {
      console.error(log);
      app.quit();
    }
  }); */
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: "./cinema-manager.ico",
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true,
    })
  );

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

const checkInitialConfig = (event) => {
  console.log("checkInitialConfig called");
  const databaseHandler = new DatabaseHandler();
  databaseHandler.doesTableExist("lookup_path", (exists) => {
    if (!exists) {
      databaseHandler.createTables((created) => {
        if (created) {
          console.log("Table Created");
          event.returnValue = { status: false, lookupPaths: undefined };
        }
      });
    } else {
      databaseHandler.getAllFromTable("lookup_path", (success, lookupPaths) => {
        if (success) {
          console.log("Records retrieved: ", records);
          event.returnValue = { status: false, lookupPaths: lookupPaths };
        }
        databaseHandler.close();
      });
    }
  });
};

const browseFolder = (event) => {
  const databaseHandler = new DatabaseHandler();
  dialog
    .showOpenDialog({ title: "Select a folder", properties: ["openDirectory"] })
    .then((folderPath) => {
      if (folderPath === undefined) {
        console.log("You didn't select a folder");
        event.returnValue = undefined;
        return;
      } else {
        databaseHandler.insertIntoLookupPath(
          folderPath.filePaths[0],
          (inserted) => {
            if (inserted) {
              event.returnValue = folderPath.filePaths[0];
            }
            databaseHandler.close();
          }
        );
      }
    });
};

const getCinemas = (event) => {
  console.log("getCinemas called");
  const databaseHandler = new DatabaseHandler();
  databaseHandler.getAllFromTable("cinema", (success, cinemas) => {
    if (success) {
      console.log("Records retrieved: ", records);
      event.returnValue = cinemas
        .filter((cinema) => cinema.showCinema === 1)
        .map((cinema) => {
          return {
            id: cinema.id,
            path: cinema.path,
            imdbId: cinema.imdb_id,
            tmdbId: cinema.tmdb_id,
            type: cinema.type,
            title: cinema.title,
            year: cinema.year,
            releaseDate: moment(cinema.release_date).toDate(),
            rated: cinema.rated,
            runtime: cinema.runtime,
            genres: cinema.genre.split(",").map((genre) => genre.trim()),
            plot: cinema.plot,
            imdbRating: cinema.imdb_rating,
            imdbVotes: Number.parseInt(cinema.imdb_votes.replace(",", "")),
            metascore: cinema.metascore,
            awards: cinema.awards,
            language: JSON.parse(cinema.language),
            director: cinema.director
              .split(",")
              .map((director) => director.trim()),
            actors: cinema.actors.split(",").map((director) => director.trim()),
            revenue: cinema.revenue,
            poster: cinema.poster,
            quality: cinema.quality,
          };
        });
    }
    databaseHandler.close();
  });
  /* event.returnValue = [
    {
      actors: [],
      country: "",
      director: [],
      genres: ["Crime", "Drama"],
      id: 100,
      imdbId: "",
      imdbRating: 9.2,
      imdbVotes: 1200000,
      language: "English",
      metascore: 90,
      plot: "A five-year-old Indian boy is adopted by an Australian couple after getting lost hundreds of kilometers from home. 25 years later, he sets out to find his lost family.",
      poster: "https://image.tmdb.org/t/p/w185/iBGRbLvg6kVc7wbS8wDdVHq6otm.jpg",
      rated: "PG",
      runtime: "1h 58m",
      starMeter: 2067,
      starMeterDifferential: 107,
      title: "Lion",
      year: 2016,
    },
    {
      actors: [],
      country: "",
      director: [],
      genres: ["Crime", "Drama"],
      id: 100,
      imdbId: "",
      imdbRating: 9.2,
      imdbVotes: 1200000,
      language: "English",
      metascore: 90,
      plot: "A five-year-old Indian boy is adopted by an Australian couple after getting lost hundreds of kilometers from home. 25 years later, he sets out to find his lost family.",
      poster: "https://image.tmdb.org/t/p/w185/iBGRbLvg6kVc7wbS8wDdVHq6otm.jpg",
      rated: "PG",
      runtime: "1h 58m",
      starMeter: 2067,
      starMeterDifferential: 107,
      title: "Lion",
      year: 2016,
    },
    {
      actors: [],
      country: "",
      director: [],
      genres: ["Crime", "Drama"],
      id: 100,
      imdbId: "",
      imdbRating: 9.2,
      imdbVotes: 1200000,
      language: "English",
      metascore: 90,
      plot: "A five-year-old Indian boy is adopted by an Australian couple after getting lost hundreds of kilometers from home. 25 years later, he sets out to find his lost family.",
      poster: "https://image.tmdb.org/t/p/w185/iBGRbLvg6kVc7wbS8wDdVHq6otm.jpg",
      rated: "PG",
      runtime: "1h 58m",
      starMeter: 2067,
      starMeterDifferential: 107,
      title: "Lion",
      year: 2016,
    },
    {
      actors: [],
      country: "",
      director: [],
      genres: ["Crime", "Drama"],
      id: 100,
      imdbId: "",
      imdbRating: 9.2,
      imdbVotes: 1200000,
      language: "English",
      metascore: 90,
      plot: "A five-year-old Indian boy is adopted by an Australian couple after getting lost hundreds of kilometers from home. 25 years later, he sets out to find his lost family.",
      poster: "https://image.tmdb.org/t/p/w185/iBGRbLvg6kVc7wbS8wDdVHq6otm.jpg",
      rated: "PG",
      runtime: "1h 58m",
      starMeter: 2067,
      starMeterDifferential: 107,
      title: "Lion",
      year: 2016,
    },
    {
      actors: [],
      country: "",
      director: [],
      genres: ["Crime", "Drama"],
      id: 100,
      imdbId: "",
      imdbRating: 9.2,
      imdbVotes: 1200000,
      language: "English",
      metascore: 90,
      plot: "A five-year-old Indian boy is adopted by an Australian couple after getting lost hundreds of kilometers from home. 25 years later, he sets out to find his lost family.",
      poster: "https://image.tmdb.org/t/p/w185/iBGRbLvg6kVc7wbS8wDdVHq6otm.jpg",
      rated: "PG",
      runtime: "1h 58m",
      starMeter: 2067,
      starMeterDifferential: 107,
      title: "Lion",
      year: 2016,
    },
    {
      actors: [],
      country: "",
      director: [],
      genres: ["Crime", "Drama"],
      id: 100,
      imdbId: "",
      imdbRating: 9.2,
      imdbVotes: 1200000,
      language: "English",
      metascore: 90,
      plot: "A five-year-old Indian boy is adopted by an Australian couple after getting lost hundreds of kilometers from home. 25 years later, he sets out to find his lost family.",
      poster: "https://image.tmdb.org/t/p/w185/iBGRbLvg6kVc7wbS8wDdVHq6otm.jpg",
      rated: "PG",
      runtime: "1h 58m",
      starMeter: 2067,
      starMeterDifferential: 107,
      title: "Lion",
      year: 2016,
    },
    {
      actors: [],
      country: "",
      director: [],
      genres: ["Crime", "Drama"],
      id: 100,
      imdbId: "",
      imdbRating: 9.2,
      imdbVotes: 1200000,
      language: "English",
      metascore: 90,
      plot: "A five-year-old Indian boy is adopted by an Australian couple after getting lost hundreds of kilometers from home. 25 years later, he sets out to find his lost family.",
      poster: "https://image.tmdb.org/t/p/w185/iBGRbLvg6kVc7wbS8wDdVHq6otm.jpg",
      rated: "PG",
      runtime: "1h 58m",
      starMeter: 2067,
      starMeterDifferential: 107,
      title: "Lion",
      year: 2016,
    },
    {
      actors: [],
      country: "",
      director: [],
      genres: ["Crime", "Drama"],
      id: 100,
      imdbId: "",
      imdbRating: 9.2,
      imdbVotes: 1200000,
      language: "English",
      metascore: 90,
      plot: "A five-year-old Indian boy is adopted by an Australian couple after getting lost hundreds of kilometers from home. 25 years later, he sets out to find his lost family.",
      poster: "https://image.tmdb.org/t/p/w185/iBGRbLvg6kVc7wbS8wDdVHq6otm.jpg",
      rated: "PG",
      runtime: "1h 58m",
      starMeter: 2067,
      starMeterDifferential: 107,
      title: "Lion",
      year: 2016,
    },
    {
      actors: [],
      country: "",
      director: [],
      genres: ["Crime", "Drama"],
      id: 100,
      imdbId: "",
      imdbRating: 9.2,
      imdbVotes: 1200000,
      language: "English",
      metascore: 90,
      plot: "A five-year-old Indian boy is adopted by an Australian couple after getting lost hundreds of kilometers from home. 25 years later, he sets out to find his lost family.",
      poster: "https://image.tmdb.org/t/p/w185/iBGRbLvg6kVc7wbS8wDdVHq6otm.jpg",
      rated: "PG",
      runtime: "1h 58m",
      starMeter: 2067,
      starMeterDifferential: 107,
      title: "Lion",
      year: 2016,
    },
    {
      actors: [],
      country: "",
      director: [],
      genres: ["Crime", "Drama"],
      id: 100,
      imdbId: "",
      imdbRating: 9.2,
      imdbVotes: 1200000,
      language: "English",
      metascore: 90,
      plot: "A five-year-old Indian boy is adopted by an Australian couple after getting lost hundreds of kilometers from home. 25 years later, he sets out to find his lost family.",
      poster: "https://image.tmdb.org/t/p/w185/iBGRbLvg6kVc7wbS8wDdVHq6otm.jpg",
      rated: "PG",
      runtime: "1h 58m",
      starMeter: 2067,
      starMeterDifferential: 107,
      title: "Lion",
      year: 2016,
    },
  ]; */
};

const printServices = (event) => {
  const wincmd = require("node-windows");
  const { exec } = require("child_process");

  wincmd.list((processes) => {
    console.log(
      "Services:",
      processes.filter(
        (process) =>
          process.SessionName === "Services" &&
          process.SessionName !== "Console"
      )[0]
    );
  }, true);

  exec('sc query "TeamViewer"', (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout.replaceAll(" ", "")}`);
    console.log(`stdout: ${stdout.indexOf("RUNNING") !== -1}`);
  });

  event.returnValue = "";
};

app.on("ready", () => {
  if (mainWindow === null) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

ipcMain.on("check-initial-config", (event, _) => {
  checkInitialConfig(event);
});

ipcMain.on("browse-folder", (event, _) => {
  browseFolder(event);
});

ipcMain.on("get-cinemas", (event, _) => {
  getCinemas(event);
});

ipcMain.on("printServices", (event, _) => {
  printServices(event);
});
