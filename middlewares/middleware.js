const User = require("../models/user");
const Host = require("../models/host");

exports.isHost = (req, res, next) => {
	const _id = req.params._id;
	console.log(_id);
	Host.findById(_id, (err, doc) => {
		if (err || !doc) {
			return res.status(401).json({ err: "Unauthorized" });
		} else {
			next();
		}
	});
};

exports.isUser = (req, res, next) => {
	const _id = req.params._id;
	User.findById(_id, (err, doc) => {
		if (err || !doc) {
			return res.status(401).json({ err: "Unauthorized" });
		} else {
			next();
		}
	});
};
