const sqlite3 = require('sqlite3');

let db = new sqlite3.Database('./spritleRailwayBooking.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

module.exports=db;
