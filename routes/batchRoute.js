const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { isHost, isUser } = require("../middlewares/middleware");
const { createBatch } = require("../controllers/batchController");
const { createSession } = require("../controllers/sessionController");

router.post("/create/:_id", isHost, createBatch);

router.post(
	"/addSession/:id",
	isHost,
	[
		check("batch_id"),
		check("name")
			.isLength({ min: 3 })
			.withMessage("Length of Name should be minimum 3!"),
		check("completed"),
	],
	createSession
);
module.exports = router;
