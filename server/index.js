const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

// import the all file
const Connection = require("./Connection");
const Router = require("./Router/user");
const BookRouter = require("./Router/book");
const IssueRouter = require("./Router/issue");
const URLRouter = require("./Router/link");
const BookUpload = require("./models/book");

// use express and env
const app = express();
const port = process.env.PORT;

Connection();

const COR = {
  origin: "*",
  Credential: true,
  methods: ["GET", "POST","DELETE", "PUT"],
};

app.use(express.static(path.join(__dirname, "uploads")));

//Middleware plugin
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(COR));
app.use(cookieParser(process.env.SECRET));

// Router
app.get("/", async (req, res) => {
 // const BookData = await BookUpload.find({});
  res.json({ book: "prakash" });
});

app.use("/user", Router);
app.use("/book", BookRouter);
app.use("/issue", IssueRouter);
app.use("/URL", URLRouter);

app.listen(port, () => console.log(`server started at port no ${port}`));
