import React from "react";
import { createGlobalStyle } from "styled-components";
import {  Page, Logo } from "./components/Utils";

const GlobalStyle = createGlobalStyle`
    body {
        font-family: 'Roboto', sans-serif;
    }
`;

function App() {
	return (
		<>
			<GlobalStyle />
			<Page>
                <Logo />

            </Page>
		</>
	);
}

export default App;
