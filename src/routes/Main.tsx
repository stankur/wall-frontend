import React, { useState } from "react";
import { Page, CenteredColumnContainer } from "../components/Utils";
import Hero from "../components/Hero";
import Navigation from "../components/Navigation";
import {
	ImageCaptionsCard,
	LoadingImageCaptionsCard,
} from "../components/ImageCaptions";
import { useInternalUserData } from "../App";
import useFetchingImage from "../hooks/dataHooks";
import { ImageData } from "../types/types";
import { useAddCaption } from "../hooks/captionHooks";
import { UserDataState } from "../hooks/authenticationHooks";
import { RequestInteractFunction, RequestInteractFunctionGivenPostData, useInteract } from "../hooks/interactionHooks";

interface ControlledImageCaptionsCardProps {
	data: ImageData;
	userData: UserDataState;
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>;
	requestFetchImages: () => void;
	requestChangeImageInteraction: RequestInteractFunctionGivenPostData;
	requestInteractCaption: RequestInteractFunction;
}

function ControlledImageCaptionsCard({
	data,
	userData,
	setUserData,
	requestFetchImages,
	requestChangeImageInteraction,
	requestInteractCaption,
}: ControlledImageCaptionsCardProps) {
	const [caption, setCaption] = useState("");
	const [addingCaption, requestAddCaption] = useAddCaption(
		userData,
		setUserData,
		data.id,
		handleAddCaptionSuccess
	);
	function handleAddCaptionSuccess() {
		setCaption("");
		return requestFetchImages();
	}

	function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		return setCaption(e.currentTarget.value);
	}

	return (
		<ImageCaptionsCard
			requestChangeImageInteraction={requestChangeImageInteraction}
			requestInteractCaption={requestInteractCaption}
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
	const [addingInteraction, requestInteract] = useInteract(
		userData,
		setUserData,
		handleInteractSuccess
	);

	function handleInteractSuccess() {
		return requestFetchImages();
	}
	return (
		<Page>
			<Hero />
			<Navigation
				userData={userData}
				setUserData={setUserData}
				requestFetchImages={requestFetchImages}
			/>
			<CenteredColumnContainer>
				{!images ? (
					<LoadingImageCaptionsCard />
				) : (
					images.map((image) => {
						return (
							<ControlledImageCaptionsCard
								requestChangeImageInteraction={requestInteract(
									"image",
									image.id
								)}
								requestInteractCaption={requestInteract}
								userData={userData}
								setUserData={setUserData}
								data={image}
								key={image.id}
								requestFetchImages={requestFetchImages}
							/>
						);
					})
				)}
			</CenteredColumnContainer>
		</Page>
	);
}

export default Main;
