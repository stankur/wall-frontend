import React from "react";
import { createGlobalStyle } from "styled-components";
import Hero from "./components/Hero"
import Navigation from "./components/Navigation";
import Errors from "./components/Errors";
import {getImages, getImageWithTopCaptions} from "./testData/testData"
import {
	Page,
	AuthenticationCard,
	ImagesContainer,
	TwoSidedCard,
} from "./components/Utils";
import {
	ImageCaptionsCard,
} from "./components/ImageCaptions";

const GlobalStyle = createGlobalStyle`
    body {
        font-family: 'Roboto', sans-serif;
    }
`;

function App() {
	return (
		<>
			<Errors
				errors={[
					{ message: "YOU ARE THE ERROR" },
					{ message: "ACTUALLY NO, YOU ARE GORGOEUS" },
					{ message: "ACTUALLY NO, YOU ARE GORGOEUS" },
					{ message: "ERROR BEEP BOP BEEP BOP MADAFAKA" },
				]}
			/>
			<GlobalStyle />
			<Page>
				<Hero />
				{/* <Navigation /> */}
				<ImagesContainer>
					<AuthenticationCard />
					<ImagesContainer>
						{getImages().images.map((image) => (
							<ImageCaptionsCard data={image} />
						))}
					</ImagesContainer>
				</ImagesContainer>
			</Page>
		</>
	);
}



export default App;
