import React, { useEffect, useState } from "react";
import { UserData } from "../types/types";
import { errorThrowingFetch, EventEmitter } from "../Utils";

type UserDataState =  UserData | false | undefined;

function useUserData(): [
	UserDataState,
	React.Dispatch<React.SetStateAction<UserDataState>>
] {
	const [userData, setUserData] = useState<UserDataState>(undefined);

	useEffect(function () {
		(async function () {
			let handleError = function () {
				setUserData(false);
			};

			if (userData === undefined) {
				let fetchedUserData = await errorThrowingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/authentication",
					{
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					},
					handleError
				);

				if (!fetchedUserData.error) {
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
				let response = await errorThrowingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/authentication/sign-up",
					{
						body: JSON.stringify({ username, password }),
						method: "POST",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					},
					signUpFailHandler
				);

				if (!response.error) {
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
				let response = await errorThrowingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/authentication/sign-in",
					{
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify({ username, password }),
						method: "POST",
					},
					signUpFailHandler
				);

				if (!response.error) {
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

export { useUserData, useSignUp, useSignIn };

export { type UserDataState };
