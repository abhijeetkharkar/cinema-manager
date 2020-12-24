'use strict';

const sqlite3 = require('sqlite3').verbose();
// const Observer = require('./folder-watcher.service');

setInterval(async () => {
    await getCinemaFiles();
}, 300000);

const getCinemaFiles = async () => {
    console.log('getCinemaFiles called');
}