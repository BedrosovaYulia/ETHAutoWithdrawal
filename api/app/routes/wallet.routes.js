module.exports = app => {
    const wallets = require("../controllers/wallet.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Wallet
    router.post("/", wallets.create);
  
    // Retrieve all Wallets
    router.get("/", wallets.findAll);

    // Delete a Wallet with id
    router.delete("/:id", wallets.delete);

  
    app.use("/api/wallets", router);
  };