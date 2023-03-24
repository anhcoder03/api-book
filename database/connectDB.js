const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect(
      `mongodb+srv://anhcoder03:Anh16101974@book.vb9opmk.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("success");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

module.exports = { connect };
