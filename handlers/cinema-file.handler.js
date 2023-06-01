"use strict";

const ptn = require("parse-torrent-name");

class CinemaFileHandler {
  static #MOVIE_FILE_EXTENSIONS = ["avi", "mkv", "mp4"];

  /**
   * Get movie info from the file path if it is a video file
   * returns { 
      year: 2014,
      quality: 'HDRip',
      codec: 'XViD',
      audio: 'AC3',
      group: 'juggs[ETRG]',
      hardcoded: true,
      title: 'AL 288-1' 
    }
  */
  getMovieFileInfo(path) {
    const lastBackslash = path.lastIndexOf("\\");
    const filename = path.substring(lastBackslash + 1);
    const lastPeriod = filename.lastIndexOf(".");
    const extension = filename.substring(lastPeriod + 1);
    if (!CinemaFileHandler.#MOVIE_FILE_EXTENSIONS.includes(extension)) {
      return undefined;
    }
    const movieFileInfoString = filename.substring(0, lastPeriod - 1);
    let movieFileInfo = ptn(movieFileInfoString);
    if (this.#isTitleWronglyProcessed(movieFileInfo)) {
      const year = Number.parseInt(
        movieFileInfo.title.substring(movieFileInfo?.title?.length - 4)
      );
      movieFileInfo.title = movieFileInfo.title.substring(
        0,
        movieFileInfo.title.length - 5
      );
      movieFileInfo = {
        ...movieFileInfo,
        year: year,
      };
    }
    return movieFileInfo;
  }

  #isTitleWronglyProcessed(movieFileInfo) {
    const lastFour = movieFileInfo?.title?.substring(
      movieFileInfo?.title?.length - 4
    );
    return (
      !Number.isNaN(lastFour) &&
      Number.parseInt(lastFour) > 1900 &&
      Number.parseInt(lastFour) <= new Date().getFullYear()
    );
  }
}

module.exports = CinemaFileHandler;
