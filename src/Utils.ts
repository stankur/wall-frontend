import { createNanoEvents } from "nanoevents";

interface Events {
	error: (message: string) => void;
	success: (message: string) => void;
}
const EventEmitter = createNanoEvents<Events>();
export { EventEmitter };
