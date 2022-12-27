import React, { useEffect, useState } from "react";
import { isAuthenticationError, UserData } from "../types/types";
import { authHandlingFetch, errorHandlingFetch, EventEmitter, generateVerificationCode } from "../Utils";
import AuthenticationConstants from "../constants/AuthenticationConstants";

import * as yup from "yup";
import emailjs from "@emailjs/browser";

type UserDataState = UserData | false | undefined;

function useUserData(): [
	UserDataState,
	React.Dispatch<React.SetStateAction<UserDataState>>
] {
	const [userData, setUserData] = useState<UserDataState>(undefined);

	useEffect(function () {
		(async function () {
			if (userData === undefined) {
				let fetchedUserData = await authHandlingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/authentication",
					setUserData,
					{
						...AuthenticationConstants.requiredConfig,
						headers: {
							"Content-Type": "application/json",
						},
					},
					handleError
				);

				if (fetchedUserData && !fetchedUserData.error) {
					return setUserData(fetchedUserData);
				}
			}
		})();
	});

	function handleError(err: Error) {
		if (!isAuthenticationError({ error: err })) {
			EventEmitter.emit("error", err.message);
		}
	}
	return [userData, setUserData];
}

function validateUserData(userData: UserDataState) {
	if (userData) {
		throw new Error("YOU ARE ALREADY SIGNED IN");
	}

	if (userData === undefined) {
		throw new Error("PLEASE TRY AGAIN IN A LITTLE WHILE");
	}
}

function validateUsername(username: string) {
	if (!AuthenticationConstants.acceptableUsername.test(username)) {
		throw new Error("USERNAME FORMAT IS INVALID");
	}
}

function validateInstagramUsername(username: string) {
    if (!AuthenticationConstants.acceptableInstagramUsername.test(username)) {
        throw new Error("USERNAME FORMAT IS INVALID");
    }
}

function validatePassword(password: string) {
	if (!AuthenticationConstants.acceptablePassword.test(password)) {
		throw new Error("PASSWORD LENGTH IS INVALID");
	}
}

function validateEmail(email: string) {
	yup.string()
		.email("EMAIL PROVIDED IS OF AN INVALID FORMAT")
		.validateSync(email);
}

function validatePreEmailVerificationInputs(
	userData: UserDataState,
	username: string,
	email: string
) {
	validateUserData(userData);
	validateUsername(username);
	validateEmail(email);
}

function validateSignUpWithInstagramInputs(
	userData: UserDataState,
	username: string,
	password: string
) {
	validateUserData(userData);
	validateInstagramUsername(username);
	validatePassword(password);
}

function validateSignUpWithEmailInputs(
	userData: UserDataState,
	username: string,
	email: string,
	password: string
) {
	validateUserData(userData);
	validateUsername(username);
	validatePassword(password);
	validateEmail(email);
}

function useSignUpWithInstagram(
	userData: UserDataState,
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>,
	signUpSuccessHandler?: (userData: UserData) => void,
	signUpFailHandler?: (error: Error) => void
): [boolean, (username: string, password: string) => void] {
	const [signingUp, setSigningUp] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	useEffect(function () {
		(async function () {
			if (signingUp) {
				let response = await errorHandlingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/authentication/sign-up",
					{
						body: JSON.stringify({ username, password }),
						method: "POST",
						...AuthenticationConstants.requiredConfig,
						headers: {
							"Content-Type": "application/json",
						},
					},
					signUpFailHandler
				);

				if (response && !response.error) {
					let username: string = response.username;
					let id: string = response.id;
					setUserData({ username, id });
					if (signUpSuccessHandler) {
						signUpSuccessHandler({ username, id } as UserData);
					}
				}

				return setSigningUp(false);
			}
		})();
	});

	const requestSignUp = function (username: string, password: string) {
		try {
			validateSignUpWithInstagramInputs(userData, username, password);
		} catch (err) {
			return EventEmitter.emit("error", (err as Error).message);
		}

		setUsername(username);
		setPassword(password);

		return setSigningUp(true);
	};

	return [signingUp, requestSignUp];
}

function useSignUpWithEmail(
	userData: UserDataState,
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>,
	signUpSuccessHandler?: (userData: UserData) => void,
	signUpFailHandler?: (error: Error) => void
): [boolean, (username: string, email: string, password: string) => void] {
	const [signingUp, setSigningUp] = useState(false);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(function () {
		(async function () {
			if (signingUp) {
				let response = await errorHandlingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/authentication/sign-up",
					{
						body: JSON.stringify({ username, email, password }),
						method: "POST",
						...AuthenticationConstants.requiredConfig,
						headers: {
							"Content-Type": "application/json",
						},
					},
					signUpFailHandler
				);

				if (response && !response.error) {
					let username: string = response.username;
					let id: string = response.id;
					setUserData({ username, id });
					if (signUpSuccessHandler) {
						signUpSuccessHandler({ username, id } as UserData);
					}
				}

				return setSigningUp(false);
			}
		})();
	});

	const requestSignUp = function (
		username: string,
		email: string,
		password: string
	) {
		try {
			validateSignUpWithEmailInputs(userData, username, email, password);
		} catch (err) {
			return EventEmitter.emit("error", (err as Error).message);
		}

		setUsername(username);
		setEmail(email);
		setPassword(password);

		return setSigningUp(true);
	};

	return [signingUp, requestSignUp];
}

function useSignIn(
	userData: UserDataState,
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>,
	signInSuccessHandler?: (userData: UserData) => void,
	signUpFailHandler?: (error: Error) => void
): [boolean, (username: string, password: string) => void] {
	const [signingIn, setSigningIn] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	useEffect(function () {
		(async function () {
			if (signingIn) {
				let response = await authHandlingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/authentication/sign-in",
					setUserData,
					{
						headers: {
							"Content-Type": "application/json",
						},
						...AuthenticationConstants.requiredConfig,
						body: JSON.stringify({ username, password }),
						method: "POST",
					},
					signUpFailHandler
				);

				if (response && !response.error) {
					let username: string = response.username;
					let id: string = response.id;
					setUserData({ username, id });
					if (signInSuccessHandler) {
						signInSuccessHandler({ username, id } as UserData);
					}
				}

				return setSigningIn(false);
			}
		})();
	});

	const requestSignIn = function (username: string, password: string) {
		if (userData) {
			return EventEmitter.emit("error", "YOU ARE ALREADY SIGNED IN");
		}

		if (userData === undefined) {
			return EventEmitter.emit(
				"error",
				"PLEASE TRY AGAIN IN A LITTLE WHILE"
			);
		}
		setUsername(username);
		setPassword(password);
		return setSigningIn(true);
	};

	return [signingIn, requestSignIn];
}

function useSignOut(
	userData: UserDataState,
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>,
	signOutSuccessHandler?: () => void,
	signOutFailHandler?: (error: Error) => void
): [boolean, () => void] {
	const [signingOut, setSigningOut] = useState(false);

	function fetchSignOutErrorHandler(err: Error) {
		if (isAuthenticationError({ error: err })) {
			if (signOutSuccessHandler) {
				return signOutSuccessHandler();
			}
		}

		if (signOutFailHandler) {
			return signOutFailHandler(err);
		}

		return EventEmitter.emit("error", err.message);
	}

	useEffect(function () {
		(async function () {
			if (signingOut) {
				let response = await authHandlingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/authentication/sign-out",
					setUserData,
					{
						...AuthenticationConstants.requiredConfig,
						method: "POST",
					},
					fetchSignOutErrorHandler
				);

				if (response && !response.error) {
					if (signOutFailHandler) {
						signOutFailHandler(
							new Error(
								"FAILED TO SIGN OUT DUE TO INTERNAL REASONS. PLEASE CONTACT THE DEVELOPER"
							)
						);
					} else {
						EventEmitter.emit(
							"error",
							"FAILED TO SIGN OUT DUE TO INTERNAL REASONS. PLEASE CONTACT THE DEVELOPER"
						);
					}
				}

				return setSigningOut(false);
			}
		})();
	});

	const requestSignOut = function () {
		if (userData === undefined) {
			return EventEmitter.emit(
				"error",
				"PLEASE TRY AGAIN IN A LITTLE WHILE"
			);
		}

		if (userData === false) {
			return EventEmitter.emit("error", "YOU ARE NOT SIGNED IN");
		}

		return setSigningOut(true);
	};

	return [signingOut, requestSignOut];
}

function useUsername(): [string, (newUsername: string) => void] {
	const [username, setUsername] = useState<string>("");

	function requestChangeUsername(newUsername: string) {
		if (
			AuthenticationConstants.almostAcceptableUsername.test(newUsername)
		) {
			return setUsername(newUsername.toUpperCase());
		}
	}

	return [username, requestChangeUsername];
}

function useInstagramUsername(): [string, boolean, (newUsername: string) => void] {
	const [username, setUsername] = useState<string>("@");
    const [isAcceptable, setIsAcceptable] = useState(false);

	function requestChangeUsername(newUsername: string) {
		const lowerCasedNewUsername = newUsername.toLowerCase();

        if (AuthenticationConstants.acceptableInstagramUsername.test(lowerCasedNewUsername)) {
            setIsAcceptable(true);
        } else {
            setIsAcceptable(false);
        }

		if (
			AuthenticationConstants.almostAcceptableInstagramUsername.test(
				lowerCasedNewUsername
			)
		) {
			return setUsername(lowerCasedNewUsername);
		}

		if (lowerCasedNewUsername === "") {
			return setUsername("@");
		}
	}

	return [username, isAcceptable, requestChangeUsername];
}

function useVerifyEmail(
	onSendEmailSuccess: (verificationCode: string) => void,
	onSendEmailFail: (err: Error) => void
): [boolean, (email: string) => void] {
	const [checkingEmailExistence, setCheckingEmailExistence] = useState(false);
	const [sendingEmail, setSendingEmail] = useState(false);
	const [email, setEmail] = useState("");
	const [verificationCode, setVerificationCode] = useState<
		string | undefined
	>(undefined);

	function getEmaiJsMessageObject() {
		return {
			user_email: email,
			verification_code: verificationCode,
		};
	}

	function internalOnSendEmailSuccess() {
		return onSendEmailSuccess(verificationCode as string);
	}

	useEffect(function () {
		(async function () {
			if (checkingEmailExistence) {
				let response = await errorHandlingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/authentication/email",
					{
						body: JSON.stringify({ email }),
						method: "POST",
						...AuthenticationConstants.requiredConfig,
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (response && !response.error) {
					let emailExists: boolean = response.exists;

					if (!emailExists) {
						setSendingEmail(true);
					} else {
						EventEmitter.emit(
							"error",
							"THE EMAIL HAS ALREADY BEEN USED."
						);
					}
				}

				return setCheckingEmailExistence(false);
			}
		})();
	});

	useEffect(function () {
		(async function () {
			if (sendingEmail) {
				try {
					emailjs
						.send(
							process.env
								.REACT_APP_VERIFICATION_EMAILJS_SERVICE as string,
							process.env
								.REACT_APP_VERIFICATION_EMAILJS_TEMPLATE as string,
							getEmaiJsMessageObject(),
							process.env
								.REACT_APP_VERIFICATION_EMAILJS_PUBLIC_KEY as string
						)
						.then(internalOnSendEmailSuccess, onSendEmailFail);
				} catch (err) {
					onSendEmailFail(
						new Error(
							"FAILED TO SEND VERIFICATION CODE. PLEASE CONTACT US ABOUT THIS"
						)
					);
				}

				return setSendingEmail(false);
			}
		})();
	});

	function requestSendVerification(email: string) {
		try {
			yup.string().email().validate(email);
		} catch (err) {
			return EventEmitter.emit("error", "EMAIL ADDRESS IS INVALID");
		}

		if (!sendingEmail && !checkingEmailExistence) {
			let verificationCode: string = generateVerificationCode();

			setVerificationCode(verificationCode);
			setEmail(email);
			return setCheckingEmailExistence(true);
		}
	}

	return [sendingEmail, requestSendVerification];
}

function useVerifyInstagram(
	onVerifySuccess: () => void,
	onVerifyFail: (err: Error) => void
): [boolean, (username: string, verificationCode: string) => void] {
	const [verifyingInstagram, setVerifyingInstagram] = useState(false);
	const [username, setUsername] = useState<string | undefined>(undefined);
	const [verificationCode, setVerificationCode] = useState<
		string | undefined
	>(undefined);

	useEffect(function () {
		(async function () {
			if (verifyingInstagram) {
				let response = await errorHandlingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/authentication/verify-instagram",
					{
						body: JSON.stringify({
							username,
							verificationCode,
						}),
						method: "POST",
						...AuthenticationConstants.requiredConfig,
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (response && !response.error) {
					let verified: boolean = response.verified;

					if (!verified) {
						onVerifyFail(
							new Error(
								"NO COMMENT BY USER WITH GIVEN USERNAME HAS BEEN FOUND ON THE VERIFICATION POST"
							)
						);
					} else {
						onVerifySuccess();
					}
				}

				return setVerifyingInstagram(false);
			}
		})();
	});

	function requestVerifyInstagram(
		username: string,
		verificationCode: string
	) {
		if (
			!AuthenticationConstants.acceptableInstagramUsername.test(username)
		) {
			return EventEmitter.emit(
				"error",
				"INSTAGRAM USERNAME PROVIDED IS INVALID"
			);
		}

		if (
			!AuthenticationConstants.acceptableVerificationCode.test(
				verificationCode
			)
		) {
			return EventEmitter.emit("error", "VERIFICATION CODE IS INVALID");
		}

		setUsername(username);
		setVerificationCode(verificationCode);
		setVerifyingInstagram(true);
	}

	return [verifyingInstagram, requestVerifyInstagram];
}

export {
	useUserData,
	useSignUpWithEmail,
	useSignIn,
	useSignOut,
	useUsername,
	useInstagramUsername,
	useVerifyEmail,
	useVerifyInstagram,
	useSignUpWithInstagram,
};

export { validatePreEmailVerificationInputs };

export { type UserDataState };
