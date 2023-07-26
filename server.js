const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 1234;
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(express.urlencoded());
app.use(express.json());
const router = require("./routes");
const db = require("./database/connectDB");
const compression = require("compression");
db.connect();

//HTTP logger
app.use(morgan("combined"));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://book-wine.vercel.app"],
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
  })
);
require("dotenv").config();
router(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
