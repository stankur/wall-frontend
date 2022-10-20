import React from "react";
import { Page, CenteredColumnContainer } from "../components/Utils";
import Hero from "../components/Hero";
import Navigation from "../components/Navigation";
import { getImages } from "../testData/testData";
import { ImageCaptionsCard } from "../components/ImageCaptions";
import { v4 as uuid } from "uuid";

function Main() {
    
	return (
		<Page>
			<Hero />
			<Navigation />
			<CenteredColumnContainer>
					{getImages().images.map((image) => (
						<ImageCaptionsCard data={image} key={uuid()} />
					))}
			</CenteredColumnContainer>
		</Page>
	);
}

export default Main;
