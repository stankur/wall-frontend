import { createNanoEvents } from "nanoevents";
import { UserDataState } from "./hooks/authenticationHooks";
import { isAuthenticationError } from "./types/types";

interface Events {
	error: (message: string) => void;
	success: (message: string) => void;
}
const EventEmitter = createNanoEvents<Events>();

async function errorHandlingFetch(
	api: string,
	config?: RequestInit,
	customErrorHandler?: (err: Error) => void
) {
	let response: Response;
	let body: any;

	try {
		if (config) {
			response = await fetch(api, config);
		} else {
			response = await fetch(api);
		}
		body = await response.json();
	} catch (err) {
		EventEmitter.emit(
			"error",
			"SORRY, PROBLEM ON OUR SIDE, NETWORK ISSUE. PLEASE TRY AGAIN SHORTLY"
		);
	}

	if (body && body.error) {
		if (customErrorHandler) {
			customErrorHandler(body.error);
		} else {
			EventEmitter.emit("error", body.error.message);
		}
	}

	return body;
}

async function authHandlingFetch(
	api: string,
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>,
	config?: RequestInit,
	customErrorHandler?: (err: Error) => void
) {
	let body: any = await errorHandlingFetch(api, config, customErrorHandler);

	if (body && body.error && isAuthenticationError({error: body.error})) {
		setUserData(false);
	}

	return body;
}

export {
	EventEmitter,
	errorHandlingFetch,
	authHandlingFetch,
};
