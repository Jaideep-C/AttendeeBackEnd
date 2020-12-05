const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const {
	createSession,
	addAttendee,
	getAll,
} = require("../controllers/sessionController");

// router.post(
//     "/createSession",

// );

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
