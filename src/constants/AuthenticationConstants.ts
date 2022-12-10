const constants = {
	requiredConfig: {
		credentials: "include" as "include",
	},
	almostAcceptableUsername: /^([a-z]|[A-Z]|[0-9])*$/,
	acceptableUsername: /^([A-Z]|[0-9]){5,30}$/,
	acceptablePassword: /.{10,200}/,
};
export default constants;
