import React, { useEffect, useState } from "react";
import { isAuthenticationError, UserData } from "../types/types";
import { authHandlingFetch, errorHandlingFetch, EventEmitter } from "../Utils";

type UserDataState =  UserData | false | undefined;

const requiredConfig = { credentials: "include" as "include" };

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
						...requiredConfig,
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (fetchedUserData && !fetchedUserData.error) {
					return setUserData(fetchedUserData);
				}
			}
		})();
	});

	return [userData, setUserData];
}

function useSignUp(
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
						...requiredConfig,
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
						...requiredConfig,
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
):[boolean, () => void] {
	const [signingOut, setSigningOut] = useState(false);

	function fetchSignOutErrorHandler(err: Error) {
		if (isAuthenticationError({ error: err })) {
			if (signOutSuccessHandler) {
				return signOutSuccessHandler();
			}
			return EventEmitter.emit("success", "SUCCESSFULLY SIGNED OUT!");
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
						...requiredConfig,
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

export { useUserData, useSignUp, useSignIn, useSignOut };

export { type UserDataState };
