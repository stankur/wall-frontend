import React from "react";
import { createGlobalStyle } from "styled-components";
import Notification from "./components/Notification";
import { Outlet } from "react-router-dom";

const GlobalStyle = createGlobalStyle`
    body {
        font-family: 'Roboto', sans-serif;
    }
`;

function App() {
	console.log(process.env.REACT_APP_BACKEND_URL);
	return (
		<>
			<Notification notification={{ type: "success", message: "lol" }} />
			<GlobalStyle />
			<Outlet />
		</>
	);
}

export default App;
