const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    // configDb(db);
    createTable(db);
  }
});

const scheduleTable = `
CREATE TABLE schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title text,
    note text,
    repeat text default x, -- x=no-repeat
    event_at TIMESTAMP,
    cron text,
    sound text default 'audio',
    speak integer default 0, -- text to speak 0=yes, 0=no
    status INTEGER DEFAULT 1, -- 1=active, 0=inactive
    sound_repeat integer default 1,
    sound_path text
);
`;

function createTable(db) {
  runQuery(db, scheduleTable);
}

function runQuery(db, sql) {
  db.run(sql, (err) => {
    if (err) {
      // console.log("Run query: ", err);
    }
  });
}

module.exports = { db };
