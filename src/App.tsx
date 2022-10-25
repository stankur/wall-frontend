import React from "react";
import { createGlobalStyle } from "styled-components";
import Notification from "./components/Notification";
import { Outlet, useOutletContext } from "react-router-dom";
import { useUserData } from "./hooks/authenticationHooks";

const GlobalStyle = createGlobalStyle`
    body {
        font-family: 'Roboto', sans-serif;
    }
`;

function App() {
	const [userData, setUserData] = useUserData();

	return (
		<>
			<Notification notification={false} />
			<GlobalStyle />
			<Outlet context={[userData, setUserData]} />
		</>
	);
}

export default App;

export function useInternalUserData() {
    return useOutletContext<ReturnType<typeof useUserData>>();
}
