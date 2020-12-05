const Batch = require("../models/batch");

exports.createBatch = (req, res) => {
	const batch = new Batch(req.body);
	batch.save((err, doc) => {
		if (err) {
			return res.status(400).json({
				err: "It failed",
				value: err,
			});
		}
		res.json(doc._id);
		console.log(doc);
	});
};
