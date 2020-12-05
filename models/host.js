const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

var hostSchema = new mongoose.Schema(
	{
		isAdmin: {
			type: Boolean,
			default: true,
		},
		fullName: {
			type: String,
			trim: true,
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
		isHost: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

// encrypt_password
hostSchema.virtual("password").set(function (password) {
	this.salt = uuidv4();
	this.encrypt_password = this.securePassword(password);
});

//Methods
hostSchema.methods = {
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
};

module.exports = mongoose.model("Host", hostSchema);
