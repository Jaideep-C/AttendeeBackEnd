const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { signUp, signIn, getHost } = require("../controllers/hostAuth");

router.post(
	"/signUp",
	[
		check("emailId").isEmail().withMessage("It is not an Email"),
		check("password")
			.isLength({ min: 6 })
			.withMessage("Minium Length of password is 6!"),
		check("fullName")
			.isLength({ min: 3 })
			.withMessage("Name is too short!")
			.isLength({ max: 32 })
			.withMessage("Name is too long!"),
	],
	signUp
);

router.post(
	"/signIn",
	[
		check("emailId").isEmail().withMessage("It is not an Email"),
		check("password")
			.isLength({ min: 6 })
			.withMessage("Minium Length of password is 6!"),
	],
	signIn
);

router.post("/getHost", getHost);
module.exports = router;
