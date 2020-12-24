'use strict';

const sqlite3 = require('sqlite3').verbose();

module.exports.checkInitialConfig = callback => {
    let db = new sqlite3.Database('./cinema-manager.db', sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err.message);
            callback(false, undefined);
            return;
        }

        db.all(`select path from lookup_paths`, (err, recordSet) => {
            var flag = false;
            var lookupPaths = undefined;
            if (err) {
                console.error(err.message);
            } else {
                flag = true;
                lookupPaths = recordSet;
            }

            db.close((err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Close the database connection.');
                callback(flag, lookupPaths);
                return;
            });
        });
    });
}