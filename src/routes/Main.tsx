import React, { useContext, useState } from "react";
import { Page, CenteredColumnContainer } from "../components/Utils";
import { Hero, MobileHero } from "../components/Hero";
import { MobileNavigation, Navigation } from "../components/Navigation";
import {
	ImageCaptionsCard,
	LoadingImageCaptionsCard,
	MobileImageCaptionsCard,
	MobileImageCaptionsCardExtended,
	MobileImageCaptionsCardProps,
} from "../components/ImageCaptions";
import { useInternalUserData } from "../App";
import { useFetchingImages } from "../hooks/dataHooks";
import { Device, ImageData } from "../types/types";
import { useAddCaption } from "../hooks/captionHooks";
import { UserDataState } from "../hooks/authenticationHooks";
import {
	RequestInteractFunction,
	RequestInteractFunctionGivenPostData,
	useInteract,
} from "../hooks/interactionHooks";
import { DeviceContext } from "../hooks/deviceHooks";
import { useNavigate } from "react-router-dom";

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

	function onClick() {
		return requestAddCaption(caption);
	}

	return (
		<ImageCaptionsCard
			requestChangeImageInteraction={requestChangeImageInteraction}
			requestInteractCaption={requestInteractCaption}
			data={data}
			onClick={onClick}
			value={caption}
			onChange={onChange}
		/>
	);
}

interface ControlledMobileImageCaptionsCardProps
	extends Pick<
		MobileImageCaptionsCardProps,
		"data" | "requestChangeImageInteraction" | "requestInteract"
	> {}

function ControlledMobileImageCaptionsCard({
	data,
	requestChangeImageInteraction,
	requestInteract,
}: ControlledMobileImageCaptionsCardProps) {
	const navigate = useNavigate();
	function onViewMoreClick() {
		return navigate("/images/" + data.id);
	}

	function onAddCaptionClick() {
		return navigate("/images/" + data.id);
	}

	return (
		<MobileImageCaptionsCard
			data={data}
			requestChangeImageInteraction={requestChangeImageInteraction}
			onViewMoreClick={onViewMoreClick}
			onAddCaptionClick={onAddCaptionClick}
			requestInteract={requestInteract}
		/>
	);
}

interface ResponsiveImageCaptionsCardsProps {
	device: Device;
	images: ImageData[];
	userData: UserDataState;
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>;
	requestFetchImages: () => void;
	requestInteract: RequestInteractFunction;
}

function ResponsiveImageCaptionsCards({
	device,
	images,
	userData,
	setUserData,
	requestFetchImages,
	requestInteract,
}: ResponsiveImageCaptionsCardsProps) {
	if (device === "mobile") {
		return (
			<>
				{images.map((image) => {
					return (
						<ControlledMobileImageCaptionsCard
							data={image}
							requestChangeImageInteraction={requestInteract(
								"image",
								image.id
							)}
							requestInteract={requestInteract}
						/>
					);
				})}
			</>
		);
	}
	return (
		<>
			{images.map((image) => {
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
			})}
		</>
	);
}

function Main() {
	const [userData, setUserData] = useInternalUserData();
	const [images, fetchingImages, requestFetchImages] = useFetchingImages();
	const [addingInteraction, requestInteract] = useInteract(
		userData,
		setUserData,
		handleInteractSuccess
	);
	const device = useContext(DeviceContext);

	function handleInteractSuccess() {
		return requestFetchImages();
	}

	return (
		<Page>
			{device === "mobile" ? (
				<MobileHero
					navigation={
						<MobileNavigation
							userData={userData}
							setUserData={setUserData}
							requestFetchImages={requestFetchImages}
						/>
					}
				/>
			) : (
				<>
					<Hero />
					<Navigation
						userData={userData}
						setUserData={setUserData}
						requestFetchImages={requestFetchImages}
					/>
				</>
			)}
			<CenteredColumnContainer>
				{!images ? (
					<LoadingImageCaptionsCard />
				) : (
					<ResponsiveImageCaptionsCards
						device={device}
						images={images}
						userData={userData}
						setUserData={setUserData}
						requestFetchImages={requestFetchImages}
						requestInteract={requestInteract}
					/>
				)}
			</CenteredColumnContainer>
		</Page>
	);
}

export default Main;
