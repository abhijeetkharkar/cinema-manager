"use strict";

const DatabaseHandler = require("../handlers/database.handler");
const FolderWatcher = require("./folder-watcher.service");
const CinemaFileHandler = require("../handlers/cinema-file.handler");
const CinemaService = require("./cinema.service");
const moment = require("moment/moment");

const getCinemaInfoFromFile = async (path) => {
  console.log("getCinemaFiles called, path:", path);
  const movieFileInfo = await new CinemaFileHandler().getMovieFileInfo(path);
  if (!movieFileInfo) {
    console.log("No file info for path:", path);
    return;
  }
  // console.log(movieFileInfo);
  const movieInfo = await new CinemaService().getCinemaInfo(
    movieFileInfo.title,
    movieFileInfo.year
  );
  // console.log(movieInfo);
  return {
    ...movieInfo,
    quality: movieFileInfo.quality,
  };
};

(async () => {
  const databaseHandler = new DatabaseHandler();
  const folderWatcher = new FolderWatcher();
  // databaseHandler.doesTableExist("lookup_path", (doesExist) => {
  //   if (!doesExist) {
  //     databaseHandler.createTables((created) => {
  //       if (created) {
  //         console.log("Table Created");
  //         databaseHandler.insertIntoLookupPath(
  //           "C:\\Users\\abhij\\Movies",
  //           (inserted) => {
  //             if (inserted) {
  //               console.log("Record Inserted");

  //               databaseHandler.getAllFromTable(
  //                 "lookup_path",
  //                 (success, records) => {
  //                   if (success) {
  //                     console.log("Records retrieved: ", records);

  //                     records.forEach((record) => {
  //                       folderWatcher.watchFolder(record.path);
  //                     });

  //                     folderWatcher.on("file-added", async (event) => {
  //                       const cinemaInfo = await getCinemaInfoFromFile(
  //                         event.path
  //                       );
  //                       databaseHandler.insertIntoCinema(
  //                         [
  //                           event.path,
  //                           cinemaInfo.imdbId,
  //                           cinemaInfo.tmdbId,
  //                           cinemaInfo.type,
  //                           cinemaInfo.title,
  //                           cinemaInfo.year,
  //                           cinemaInfo.releaseDate,
  //                           cinemaInfo.rated,
  //                           cinemaInfo.runtime,
  //                           cinemaInfo.genre,
  //                           cinemaInfo.plot,
  //                           cinemaInfo.imdbRating,
  //                           cinemaInfo.imdbVotes,
  //                           cinemaInfo.metascore,
  //                           cinemaInfo.awards,
  //                           cinemaInfo.language,
  //                           cinemaInfo.director,
  //                           cinemaInfo.actors,
  //                           cinemaInfo.revenue,
  //                           cinemaInfo.poster,
  //                           cinemaInfo.quality,
  //                           moment().format(),
  //                         ],
  //                         (insertedCinema) => {
  //                           if (insertedCinema) {
  //                             console.log("Cinema Inserted");
  //                           }
  //                         }
  //                       );
  //                     });
  //                   }
  //                 }
  //               );
  //             }
  //           }
  //         );
  //       }
  //     });
  //   } else {
  //     databaseHandler.getAllFromTable("lookup_path", (success, records) => {
  //       if (success) {
  //         console.log("Records retrieved: ", records);
  //         /* databaseHandler.delete('lookup_path', records[0].id, (deleted) => {
  //           if (deleted) {
  //             console.log("Record Deleted");
  //           }
  //         }); */
  //         records.forEach((record) => {
  //           folderWatcher.watchFolder(record.path);
  //         });

  //         folderWatcher.on("file-added", async (event) => {
  //           await getCinemaInfoFromFile(event.path);
  //         });
  //       }
  //     });
  //   }
  // });
  databaseHandler.getAllFromTable("lookup_path", (success, records) => {
    if (success) {
      console.log("Records retrieved: ", records);

      records.forEach((record) => {
        folderWatcher.watchFolder(record.path);
      });

      folderWatcher.on("file-added", async (event) => {
        const cinemaInfo = await getCinemaInfoFromFile(event.path);
        databaseHandler.insertIntoCinema(
          [
            event.path,
            cinemaInfo.imdbId,
            cinemaInfo.tmdbId,
            cinemaInfo.type,
            cinemaInfo.title,
            cinemaInfo.year,
            cinemaInfo.releaseDate,
            cinemaInfo.rated,
            cinemaInfo.runtime,
            cinemaInfo.genre,
            cinemaInfo.plot,
            cinemaInfo.imdbRating,
            cinemaInfo.imdbVotes,
            cinemaInfo.metascore,
            cinemaInfo.awards,
            JSON.stringify(cinemaInfo.language),
            cinemaInfo.director,
            cinemaInfo.actors,
            cinemaInfo.revenue,
            cinemaInfo.poster,
            cinemaInfo.quality,
            moment().format(),
          ],
          (insertedCinema) => {
            if (insertedCinema) {
              console.log("Cinema Inserted");
            }
          }
        );
      });
    }
  });
})();
