const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { signUp, signIn, getUser } = require("../controllers/userAuth");

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
		/*   
			emailId Check is removed 
			To permit non-emailId requests
			Which have UniqueId
		*/
		// check("emailId").isEmail().withMessage("It is not an Email"),
		check("password")
			.isLength({ min: 6 })
			.withMessage("Minium Length of password is 6!"),
	],
	signIn
);

router.post("/getUser", getUser);
module.exports = router;
