const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

var sessionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		attendees: {
			type: [ObjectId],
			ref: "User",
		},
		description: {
			type: String,
			default: "",
		},
		completed: {
			type: Boolean,
			required: true,
		},
	},
	{ timestamps: true }
);

sessionSchema.methods = {
	addAnAttendee: function (_id) {
		if (_id != "") {
			this.attendees.push(_id);
		}
	},
	markComplete: function () {
		this.completed = true;
	},
};

module.exports = mongoose.model("Session", sessionSchema);
