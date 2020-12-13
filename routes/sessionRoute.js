const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const {
	createSession,
	addAttendee,
	getAll,
	markComplete,
} = require("../controllers/sessionController");

router.post("/markComplete", [check("_id")], markComplete);

router.post(
	"/createSession",
	[
		check("name")
			.isLength({ min: 3 })
			.withMessage("Length of Name should be minimum 3!"),
		check("completed"),
	],
	createSession
);

router.post(
	"/addAttendee",
	[
		check("sessionId"),
		check("userId"), //.withMessage("Invalid User"),
		// check("NaN"),
	],
	addAttendee
);

router.get("/getAll", getAll);
module.exports = router;
