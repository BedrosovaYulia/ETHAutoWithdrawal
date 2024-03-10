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

// Delete a Wallet with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Wallet.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Wallet with id=${id}. Maybe Wallet was not found!`
        });
      } else {
        res.send({
          message: "Wallet was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Wallet with id=" + id
      });
    });
};

