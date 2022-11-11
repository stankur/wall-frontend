import React, { useContext, useState } from "react";
import { useFetchingImage } from "../hooks/dataHooks";
import { useParams } from "react-router-dom";

import {
	MobileImageCaptionsCardExtended,
	MobileImageCaptionsCardExtendedProps,
} from "../components/ImageCaptions";

import { ExpandedPostParams } from "../types/types";
import { useInternalUserData } from "../App";
import { DeviceContext } from "../hooks/deviceHooks";
import { useInteract } from "../hooks/interactionHooks";
import { CenteredColumnContainer, Page } from "../components/Utils";
import { ResponsivePlainLogoHero } from "../components/Hero";
import { UserDataState } from "../hooks/authenticationHooks";
import { useAddCaption } from "../hooks/captionHooks";

interface ControlledMobileImageCaptionsCardExtendedProps
	extends Omit<
		MobileImageCaptionsCardExtendedProps,
		"value" | "onClick" | "onChange"
	> {
	userData: UserDataState;
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>;
	requestFetchImages: () => void;
}

function ControlledMobileImageCaptionsCardExtended({
	data,
	userData,
	setUserData,
	requestFetchImages,
	requestChangeImageInteraction,
	requestInteractCaption,
}: ControlledMobileImageCaptionsCardExtendedProps) {
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
		<MobileImageCaptionsCardExtended
			requestChangeImageInteraction={requestChangeImageInteraction}
			requestInteractCaption={requestInteractCaption}
			data={data}
			onClick={onClick}
			value={caption}
			onChange={onChange}
		/>
	);
}

function ExpandedPost() {
	const { id } = useParams<ExpandedPostParams>();
	const [userData, setUserData] = useInternalUserData();
	const [image, fetchingImage, requestFetchImage] = useFetchingImage(
		id as string
	);
	const [addingInteraction, requestInteract] = useInteract(
		userData,
		setUserData,
		handleInteractSuccess
	);
	const device = useContext(DeviceContext);

	function handleInteractSuccess() {
		return requestFetchImage();
	}

	return (
		<Page>
			<ResponsivePlainLogoHero device={device} />
			<CenteredColumnContainer>
				{(() => {
					if (device !== "mobile") {
						return (
							<span>
								Currently only available in mobile phones
							</span>
						);
					}

					if (!image) {
						// should be change a loading component for mobile
						return;
					}

					return (
						<ControlledMobileImageCaptionsCardExtended
							requestChangeImageInteraction={requestInteract(
								"image",
								image.id
							)}
							requestInteractCaption={requestInteract}
							userData={userData}
							setUserData={setUserData}
							data={image}
							key={image.id}
							requestFetchImages={requestFetchImage}
						/>
					);
				})()}
			</CenteredColumnContainer>
		</Page>
	);
}

export default ExpandedPost;
