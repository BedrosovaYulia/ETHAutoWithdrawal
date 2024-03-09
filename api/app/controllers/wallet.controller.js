const db = require("../models");
const Wallet = db.wallets;

// Create and Save a new Wallet
exports.create = (req, res) => {
  // Validate request
  if (!req.body.address) {
    res.status(400).send({ message: "Address can not be empty!" });
    return;
  }

  // Create a Wallet
  const wallet = new Wallet({
    address: req.body.address,
    privateKey: req.body.privateKey,
    addressTo: req.body.addressTo,
    gasMultiplier: req.body.gasMultiplier
  });

  // Save Wallet in the database
  wallet
    .save(wallet)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Wallet."
      });
    });
};

// Retrieve all Wallets from the database.
exports.findAll = (req, res) => {
  const hash = req.query.hash;
  var condition = hash ? { hash: { $regex: new RegExp(hash), $options: "i" } } : {};

  Wallet.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving wallets."
      });
    });
};

//TODO: delete wallet

