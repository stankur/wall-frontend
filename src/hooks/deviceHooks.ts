import React, { useEffect, useState } from "react";
import { Device } from "../types/types";

function getDevice(): Device {
	let width = window.innerWidth;

	if (width > 900) {
		return "desktop";
	}

	if (width > 620) {
		return "tablet";
	}

	return "mobile";
}

function useDevice() {
	const [device, setDevice] = useState<Device>(getDevice());

	useEffect(() => {
		function updateDevice() {
			return setDevice(getDevice());
		}

		window.addEventListener("resize", updateDevice);
		return () => window.removeEventListener("resize", updateDevice);
	});

	return device;
}

let DeviceContext = React.createContext<Device>("desktop");

export { useDevice, DeviceContext };
