const Session = require("../models/session");
const Batch = require("../models/batch");
const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const { use } = require("../routes/userAuth");

exports.createSession = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			param: errors.array()[0].param,
			err: errors.array()[0].msg,
		});
	}

	const session = new Session(req.body);
	// const batch_id = req.body.batchId;

	// Batch.findById(batch_id, (err, batch) => {
	// 	if (err || !batch) {
	// 		return res.status(400).json({
	// 			err: "It failed",
	// 			value: err,
	// 		});
	// 	}
	// });

	session.save((err, doc) => {
		if (err || !doc) {
			return res.status(400).json({
				err: "It failed",
				// err: err,
				value: err,
			});
		}
		Batch.findById("5fa6bdafd72cb81d08ee451c", (err, batch) => {
			if (err || !batch) {
				return res.json({
					err: "It failed",
				});
			}
			batch.addSession(doc._id);
			Batch.findByIdAndUpdate(batch._id, batch, (err, savedBatch) => {
				if (err || !savedBatch) {
					return res.json({ err: "It Failed" });
				}
			});
		});
		console.log(doc);
		return res.json({ _id: doc._id });
	});
};

exports.addAttendee = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			param: errors.array()[0].param,
			err: errors.array()[0].msg,
		});
	}
	const { sessionId, userId } = req.body;
	console.log(req.body);

	User.findById(userId, (_err, _doc) => {
		if (_err || !_doc) {
			return res.json({ err: "It Failed 3" });
		} else {
			Session.findById(sessionId, (err, doc) => {
				console.log("lma");
				if (err || !doc) {
					return res.json({ err: "It Failed 1" });
				}
				try {
					doc.addAnAttendee(userId);
				} catch {
					return res.json({ err: "It Failed 2" });
				}
				Session.findByIdAndUpdate(doc._id, doc, { new: true }, (_err, _doc) => {
					if (_err || !_doc) {
						console.log(_err);
						return res.json({ err: "It Failed 1" });
					} else {
						console.log(_doc);
						User.findById(userId, (_err, _doc) => {
							if (_err || !_doc) {
								return res.json({ err: "It Failed 3" });
							}
							try {
								_doc.addSession(sessionId);
								console.log(_doc.attended.sessions);
							} catch {
								console.log("Ohh Exception!");

								return res.json({ err: "It Failed 4" });
							}
							// doc.save();
							User.findByIdAndUpdate(
								_doc._id,
								_doc,
								{ new: true },
								(err, doc) => {
									if (err || !doc) {
										console.log(err);
										return res.json({ err: "It Failed 1" });
									} else {
										console.log(doc);
										return res.status(200).json({});
									}
								}
							);
						});
					}
				});
			});
		}
	});
};

exports.getAll = (req, res) => {
	Session.find((err, doc) => {
		if (err || !doc) {
			return res.json({ err: "It failed" });
		}
		return res.json(doc);
	});
	// return res.json();
};

exports.markComplete = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			param: errors.array()[0].param,
			err: errors.array()[0].msg,
		});
	}
	const { _id } = req.body;
	console.log(req.body);
	Session.findById(_id, (err, _session) => {
		if (err || !_session) {
			console.log(_session);
			return res.json({ err: "It failed" });
		}

		_session.markCompleted();
		Session.findByIdAndUpdate(
			_session.id,
			_session,
			{ new: true },
			(_err, _doc) => {
				if (_err || !_doc) {
					return res.json({ err: "It failed" });
				}
				return res.json({ ok: "Success" });
			}
		);
	});
};
