module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      address: String,
      privateKey: String,
      addressTo: String,
      gasMultiplier: Number
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Wallet = mongoose.model("wallets", schema);
  return Wallet;
};