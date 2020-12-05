const Host = require("../models/host");
const { validationResult } = require("express-validator");

exports.signUp = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			param: errors.array()[0].param,
			err: errors.array()[0].msg,
		});
	}
	const host = new Host(req.body);

	host.save((err, host) => {
		if (err) {
			return res.status(400).json({
				err: "Couldn't SignUp ",
				value: err,
			});
		}
		res.json({ _id: host._id });
		console.log(host);
	});
};

exports.signIn = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			param: errors.array()[0].param,
			err: errors.array()[0].msg,
		});
	}

	// No errors occurred in the Express-Validator Layer
	const { emailId, password, uniqueId } = req.body;

	Host.findOne({ emailId }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				err: "USER do not exist!",
			});
		}

		// If the passwords do not match
		if (!user.authenticate(password)) {
			return res.status(401).json({
				err: "Email & password do not match!",
			});
		}
		// User is Found and Authenticated
		const { _id } = user;
		return res.status(200).json({ _id });
	});
};

exports.getHost = (req, res) => {
	const _id = req.body._id;
	if (!_id) {
		return res.json({ err: "Invalid User" });
	}
	Host.findById(_id, (err, doc) => {
		if (err || !doc) {
			return res.json({ err: "Invalid User" });
		}
		return res.json(doc);
	});
};
