// Dependencies
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Route Dependencies
const userAuthRoutes = require("./routes/userAuth");
const hostAuthRoutes = require("./routes/hostAuth");
const batchAuthRoutes = require("./routes/batchRoute");
const sessionRoutes = require("./routes/sessionRoute");

// DataBase Connection
mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log(`Connected`);
	});

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
// default Route
app.get("/", (req, res) => {
	return res.status(200).json({ Hey: "LOL" });
});
// Routes
app.use("/api/user", userAuthRoutes);
app.use("/api/host", hostAuthRoutes);
app.use("/api/batch", batchAuthRoutes);
app.use("/api/session", sessionRoutes);
//Port
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
	console.log(`Hi Dudes at ${port}`);
});
