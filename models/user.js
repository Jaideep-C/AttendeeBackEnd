const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = mongoose.Schema;

var userSchema = new mongoose.Schema(
	{
		isAdmin: {
			type: Boolean,
			default: false,
		},
		batch: {
			type: ObjectId,
			ref: "Batch",
			default: "5fa6bdafd72cb81d08ee451c",
			// required: true,
		},
		attendancePercentage: {
			type: Number,
			default: 100.0,
		},
		attended: {
			count: {
				type: Number,
				default: 0,
			},
			sessions: {
				type: [ObjectId],
				default: [],
				ref: "Session",
			},
		},
		absent: {
			count: {
				type: Number,
				default: 0,
			},
			sessions: {
				type: [ObjectId],
				default: [],
				ref: "Session",
			},
		},
		fullName: {
			type: String,
			trim: true,
			required: true,
		},
		uniqueId: {
			type: String,
			trim: true,
			unique: true,
			required: true,
		},
		emailId: {
			type: String,
			trim: true,
			unique: true,
			required: true,
		},
		encrypt_password: {
			type: String,
			required: true,
		},
		salt: {
			type: String,
		},
	},
	{ timestamps: true }
);

// encrypt_password
userSchema.virtual("password").set(function (password) {
	this.salt = uuidv4();
	this.encrypt_password = this.securePassword(password);
});

//Methods
userSchema.methods = {
	authenticate: function (plainPassword) {
		return this.securePassword(plainPassword) === this.encrypt_password;
	},
	securePassword: function (plainPassword) {
		if (!plainPassword) return "";
		try {
			return crypto
				.createHmac("sha256", this.salt)
				.update(plainPassword)
				.digest("hex");
		} catch (err) {
			return "";
		}
	},
	generateAttendancePercentage: function () {
		var totalSessions = this.attended.count + this.absent.count;
		var attendedSession = this.attended.count;
		try {
			this.attendancePercentage = (totalSessions / attendedSession).toPrecision(
				3
			);
		} catch (error) {
			console.log(error);
		}
	},
	addSession: function (_id) {
		this.attended.sessions.push(_id);
		this.attended.count = this.attended.sessions.length;
	},
};

//Exporting
module.exports = mongoose.model("User", userSchema);
