import React, { useState } from "react";
import { Page, CenteredColumnContainer } from "../components/Utils";
import Hero from "../components/Hero";
import Navigation from "../components/Navigation";
import { getImages } from "../testData/testData";
import {
	ImageCaptionsCard,
	LoadingImageCaptionsCard,
} from "../components/ImageCaptions";
import { ImageCaptionsCardProps } from "../components/ImageCaptions";
import { v4 as uuid } from "uuid";
import { useInternalUserData } from "../App";
import useFetchingImage from "../hooks/dataHooks";
import { AddCaptionResponse, ImageData } from "../types/types";
import { useAddCaption } from "../hooks/captionHooks";
import { UserDataState } from "../hooks/authenticationHooks";
import { EventEmitter } from "../Utils";

interface ControlledImageCaptionsCardProps {
	data: ImageData;
	userData: UserDataState;
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>;
	requestFetchImages: () => void;
}

function ControlledImageCaptionsCard({
	data,
	userData,
	setUserData,
	requestFetchImages,
}: ControlledImageCaptionsCardProps) {
	const [caption, setCaption] = useState("");
	const [addingCaption, requestAddCaption] = useAddCaption(
		userData,
		setUserData,
		data.id,
		handleAddCapptionSuccess
	);
	function handleAddCapptionSuccess() {
		setCaption("");
		return requestFetchImages();
	}

	function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		return setCaption(e.currentTarget.value);
	}

	return (
		<ImageCaptionsCard
			data={data}
			onClick={function () {
				requestAddCaption(caption);
			}}
			value={caption}
			onChange={onChange}
		/>
	);
}

function Main() {
	const [userData, setUserData] = useInternalUserData();
	const [images, fetchingImages, requestFetchImages] = useFetchingImage();
	return (
		<Page>
			<Hero />
			<Navigation userData={userData} setUserData={setUserData} />
			<CenteredColumnContainer>
				<LoadingImageCaptionsCard />
				{fetchingImages || !images ? (
					<LoadingImageCaptionsCard />
				) : (
					images.map((image) => (
						<ControlledImageCaptionsCard
							userData={userData}
							setUserData={setUserData}
							data={image}
							key={image.id}
							requestFetchImages={requestFetchImages}
						/>
					))
				)}
			</CenteredColumnContainer>
		</Page>
	);
}

export default Main;
