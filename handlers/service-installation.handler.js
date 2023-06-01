"use strict";

var Service = require("node-windows").Service;

module.exports.installService = async (callback) => {
  const svc = new Service({
    name: "Cinema Finder",
    description:
      "Finds video files in the machine and gets information for the movies using RapidApi. The output is stored to SQLite and is used by Cinema Manager",
    script: "./services/cinema-finder.service.js",
  });

  console.log("Cinema Finder not running!!!");
  svc.on("install", () => {
    console.log("Cinema Finder installed successfully!!!");
    svc.start();
  });

  svc.on("alreadyinstalled", () => {
    console.log("Cinema Finder found to be already installed.");
    svc.uninstall();
  });

  svc.on("uninstall", () => {
    console.log("Cinema Finder uninstalled successfully!!!");
    svc.install();
  });

  svc.on("start", () => {
    console.log("Cinema Finder started successfully!!!");
    callback(true);
    return;
  });

  svc.on("error", (error) => {
    console.error(
      `Error occurred in the installation and starting of Cinema Finder service. Details: ${error}`
    );
    callback(
      false,
      `Error occurred in the installation and starting of Cinema Finder service. Details: ${error}`
    );
  });

  svc.install();
};
