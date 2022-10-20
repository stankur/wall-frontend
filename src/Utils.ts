import { createNanoEvents } from "nanoevents";

interface Events {
	error: (message: string) => void;
	success: (message: string) => void;
}
const EventEmitter = createNanoEvents<Events>();

async function errorThrowingFetch(
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

	if (body.error) {
		if (customErrorHandler) {
			return customErrorHandler(body.error);
		}
		return EventEmitter.emit("error", body.error.message);
	}

	return body;
}

export { EventEmitter, errorThrowingFetch };
