const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prenom text, 
            nom text, 
            age INTEGER 
            )`,
            (err) => {
                if (err) {
                    // Table already created
                }else{
                    // Table just created, creating some rows
                    const insert = 'INSERT INTO user (prenom, nom, age) VALUES (?,?,?)';
                    db.run(insert, ["Assane","Dione",26])
                    db.run(insert, ["Fatou","fall",18])
                }
            });
    }
});


module.exports = db
