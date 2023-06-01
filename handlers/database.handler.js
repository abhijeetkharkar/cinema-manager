"use strict";

const sqlite3 = require("sqlite3").verbose();

class DatabaseHandler {
  #db;

  constructor() {
    this.#db = new sqlite3.Database(
      "./cinema-manager.sqlite",
      sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          console.error("Constructor, Error: ", err.message);
        } else {
          console.log("Database Opened/Created.");
        }
      }
    );
  }

  doesTableExist(tableName, callback) {
    const query = `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`;
    this.#db.all(query, [tableName], (err, recordSet) => {
      if (err) {
        console.error(err.message);
        callback(false);
      } else {
        callback(recordSet?.length > 0);
      }
    });
  }

  createTables(callback) {
    const query = `
    create table lookup_path (
        id INTEGER PRIMARY KEY,
        path TEXT NOT NULL
    );
    create table cinema (
      id INTEGER PRIMARY KEY,
      path TEXT NOT NULL,
      imdb_id TEXT,
      tmdb_id INTEGER,
      type TEXT,
      title TEXT,
      year INTEGER,
      release_date TEXT,
      rated TEXT,
      runtime INTEGER,
      genre TEXT,
      plot TEXT,
      imdb_rating REAL,
      imdb_votes TEXT,
      metascore INTEGER,
      awards TEXT,
      language TEXT,
      director TEXT,
      actors TEXT,
      revenue INTEGER,
      poster TEXT,
      quality TEXT,
      showCinema INTEGER DEFAULT 1,
      last_updated_date TEXT NOT NULL
    );
    `;
    this.#db.exec(query, (err) => {
      if (err) {
        console.error(err.message);
        callback(false);
      } else {
        callback(true);
      }
    });
  }

  insertIntoLookupPath(path, callback) {
    const query = `insert into lookup_path (path) values (?)`;
    this.#db.run(query, [path], (err) => {
      if (err) {
        console.error(err.message);
        callback(false);
      } else {
        callback(true);
      }
    });
  }

  insertIntoCinema(cinemaParams, callback) {
    const query = `insert into cinema (path, imdb_id, tmdb_id, type, title, year, release_date, rated, runtime, genre, plot, imdb_rating, imdb_votes, metascore, awards, language, director, actors, revenue, poster, quality, last_updated_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    this.#db.run(query, cinemaParams, (err) => {
      if (err) {
        console.error(err.message);
        callback(false);
      } else {
        callback(true);
      }
    });
  }

  getAllFromTable(tableName, callback) {
    const query = `select id, path from ${tableName};`;
    this.#db.all(query, (err, recordSet) => {
      if (err) {
        console.error(err.message);
        callback(false, undefined);
      } else {
        callback(true, recordSet);
      }
    });
  }

  deleteFromTable(tableName, id, callback) {
    const query = `delete from ${tableName} where id=?;`;
    this.#db.run(query, [id], (err) => {
      if (err) {
        console.error(err.message);
        callback(false);
      } else {
        callback(true);
      }
    });
  }

  close() {
    this.#db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Database connection closed.");
    });
  }
}

module.exports = DatabaseHandler;
