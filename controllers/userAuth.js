const User = require("../models/user");
const { validationResult } = require("express-validator");
const Batch = require("../models/batch");
exports.signUp = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			param: errors.array()[0].param,
			err: errors.array()[0].msg,
		});
	}
	const user = new User(req.body);

	user.save((err, user) => {
		if (err) {
			return res.status(400).json({
				err: "It failed",
				value: err,
			});
		}
		res.json({ _id: user._id });
		console.log(user);
	});
};

exports.signIn = (req, res) => {
	console.log(req);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			param: errors.array()[0].param,
			err: errors.array()[0].msg,
		});
	}
	// No errors occurred in the Express-Validator Layer
	const { emailId, password, uniqueId } = req.body;

	if (!uniqueId && !emailId) {
		return res.status(400).json({
			param: ["emailId", "uniqueId"],
			err: "emailId or uniqueId required to authenticate!",
		});
	}

	if (!uniqueId) {
		/*
			Finding User By EmailID
		*/
		User.findOne({ emailId }, (err, user) => {
			// If the User do not exist!
			console.log(`Via !uniqueId ${!uniqueId}`);

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
			return res.json({ _id });
		});
	} else {
		/*
			Finding User By UniqueId
		*/
		User.findOne({ uniqueId }, (err, user) => {
			// If the User do not exist!
			console.log(`Via !uniqueId ${!uniqueId}`);
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
			return res.json({ _id });
		});
	}
};

exports.getUser = (req, res) => {
	const _id = req.body._id;
	if (!_id) {
		return res.json({ err: "Invalid User" });
	}
	User.findById(_id, (err, doc) => {
		if (err || !doc) {
			return res.json({ err: "Invalid User" });
		}
		// console.log(doc.attendancePercentage);
		Batch.findById("5fa6bdafd72cb81d08ee451c", (_err, batch) => {
			if (_err || !batch) {
				return res.json({ err: "Invalid User" });
			}
			var lis = batch.session.sessions;
			for (let x of lis) {
				if (doc.attended.sessions.includes(x) == false) {
					doc.addAbsentSession(x);
				}
			}

			try {
				doc.generateAttendancePercentage();
			} catch (error) {
				console.log(error);
			}
			console.log(doc.attendancePercentage);
			return res.json(doc);
		});
	});
};

exports.getAll = (req, res) => {
	User.find((err, doc) => {
		if (err || !doc) {
			return res.json({ err: "It failed" });
		}
		return res.json(doc);
	});
};
