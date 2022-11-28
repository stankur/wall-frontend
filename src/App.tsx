import React, { useState } from "react";
import { createGlobalStyle } from "styled-components";
import Notification from "./components/Notification";
import { Outlet, useOutletContext } from "react-router-dom";
import { useUserData } from "./hooks/authenticationHooks";
import { DeviceContext, useDevice } from "./hooks/deviceHooks";
import ExpandableMessageForm from "./components/MessageForm";
import { EventEmitter } from "./Utils";

const GlobalStyle = createGlobalStyle`
    body {
        font-family: 'Roboto', sans-serif;
    }
`;

function App() {
	const [userData, setUserData] = useUserData();
	const device = useDevice();

    const [messageFormExpanded, setMessageFormExpanded] = useState(false);

	function onExpandClick() {
		return setMessageFormExpanded(true);
	}

	function onSendSuccess() {
		EventEmitter.emit(
			"success",
			"SUCCESSFULLY SUBMITTED. THANK YOU, THAT REALLY MEANS A LOT!"
		);
		return setMessageFormExpanded(false);
	}

	function onSendFailure() {
			return EventEmitter.emit(
				"error",
				`FAILED TO SUBMIT. PLEASE CONTACT US ABOUT THIS.`
			);
	}

	function onCancelClick() {
		return setMessageFormExpanded(false);
	}

	return (
		<DeviceContext.Provider value={device}>
			<Notification notification={false} />
			<GlobalStyle />
			<Outlet context={[userData, setUserData]} />
			<ExpandableMessageForm
				expanded={messageFormExpanded}
				onExpandClick={onExpandClick}
				onSendSuccess={onSendSuccess}
				onSendFailure={onSendFailure}
				onCancelClick={onCancelClick}
                device={device}
			/>
		</DeviceContext.Provider>
	);
}

export default App;

export function useInternalUserData() {
	return useOutletContext<ReturnType<typeof useUserData>>();
}
