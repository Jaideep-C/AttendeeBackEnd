const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
// const { sessionSchema } = require("./session");
var batchSchema = new mongoose.Schema(
	{
		batchName: {
			type: String,
			required: true,
			unique: true,
		},
		members: {
			type: [ObjectId],
			ref: "User",
		},
		session: {
			count: {
				type: Number,
				default: 0,
			},
			sessions: {
				type: [ObjectId],
				ref: "Session",
			},
		},
	},
	{ timestamps: true }
);

batchSchema.methods = {
	addUser: function (_id) {
		console.log(`lol`);
		if (_id != "") {
			this.members.push(_id);
		}
	},
	addSession: function (_id) {
		console.log(`lol`);
		if (_id != "") {
			this.session.sessions.push(_id);
		}
		this.session.count = this.session.sessions.length;
	},
};

module.exports = mongoose.model("Batch", batchSchema);
