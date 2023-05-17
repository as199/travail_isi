const express = require('express');
const router = express.Router();
const db = require('../database/db.js')

/* GET users listing. */
router.get('/users', function(req, res, next) {
  const sql = "select * from user";
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
      "message":"success",
      "data":rows
    })
  });
});

/**
 * Get one user by id
 */
router.get("/users/:id", (req, res, next) => {
  const sql = "select * from user where id = ?";
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
      "message":"success",
      "data":row
    })
  });
});

/**
 * Create a new user
 */
router.post("/users", (req, res, next) => {
  const errors = [];
  if (!req.body.prenom){
    errors.push("Veuillez saisir votre prenom");
  }
  if (!req.body.nom){
    errors.push("Veuillez saisir votre nom");
  }
  if (!req.body.age){
    errors.push("Veuillez saisir votre age");
  }
  if (errors.length){
    res.status(400).json({"error":errors.join(",")});
    return;
  }
  const data = {
    prenom: req.body.prenom,
    nom: req.body.nom,
    age: req.body.age
  };
  const sql = 'INSERT INTO user (prenom, nom, age) VALUES (?,?,?)';
  const params = [data.prenom, data.nom, data.age];
  db.run(sql, params, function (err, result) {
    if (err){
      res.status(400).json({"error": err.message})
      return;
    }
    res.json({
      "message": "success",
      "data": data,
      "id" : this.lastID
    })
  });
});

/**
 * Update a user
 */
router.patch("/users/:id", (req, res, next) => {
const data = {
    prenom: req.body.prenom,
    nom: req.body.nom,
    age: req.body.age
  };
  db.run(
    `UPDATE user set 
       prenom = COALESCE(?,prenom), 
       nom = COALESCE(?,nom), 
       age = COALESCE(?,age) 
       WHERE id = ?`,
    [data.prenom, data.nom, data.age, req.params.id],
    (err, result) => {
      if (err){
        res.status(400).json({"error": res.message});
        return;
      }
      res.json({
        message: "success",
        data: data,
        changes: this.changes
      })
  });
});

/**
 * Delete a user
 */
router.delete("/users/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
        if (err){
            res.status(400).json({"error": res.message});
            return;
        }
        res.json({"message":"deleted", changes: this.changes})
    });
});

module.exports = router;
