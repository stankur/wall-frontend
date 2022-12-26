const constants = {
	requiredConfig: {
		credentials: "include" as "include",
	},
	almostAcceptableUsername: /^([a-z]|[A-Z]|[0-9])*$/,
	almostAcceptableInstagramUsername: /^@[a-z0-9._]{0,30}$/,
	acceptableUsername: /^([A-Z]|[0-9]){5,30}$/,
	acceptablePassword: /.{10,200}/,
	acceptableInstagramUsername: /^@[a-z0-9._]{1,30}$/,
	acceptableVerificationCode: /^[0-9]{6,6}$/,
};

export default constants;
