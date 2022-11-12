import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useInternalUserData } from "../App";
import {  ResponsivePlainLogoHero } from "../components/Hero";
import { ResponsiveAddImagePreview } from "../components/ImageCaptions";
import {
	CenteredColumnContainer,
	ResponsiveDescription,
	Page,
} from "../components/Utils";
import { useAddImage } from "../hooks/imageHooks";
import ImageConstants from "../constants/ImageConstants";
import PreviewConstants from "../constants/PreviewConstants";
import { EventEmitter } from "../Utils";
import { DeviceContext } from "../hooks/deviceHooks";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const RotatingImage = styled.img`
	animation: ${rotate} 1.5s ease-in infinite;
`;

// assumes that user data is not undefined or false
function AddImage() {
	const [userData, setUserData] = useInternalUserData();
	const [image, setImage] = useState<File | undefined>(undefined);
	const [addingImage, requestAddImage, accImageInputTypes] = useAddImage(
		userData,
		setUserData,
		handleAddImageSuccess
	);
	const navigate = useNavigate();
    const device = useContext(DeviceContext);

	function requestChangeImage(newImage: File | undefined) {
		(async function () {
			if (newImage) {
				let validDimensions = await ImageConstants.isDimensionValid(
					URL.createObjectURL(newImage)
				);

				if (!validDimensions) {
					setImage(undefined);
					return EventEmitter.emit(
						"error",
						`IMAGE ASPECT RATIO MUST BE BETWEEN ${ImageConstants.minAccAspectRatio} AND ${ImageConstants.maxAccAspectRatio}`
					);
				}
			}
			return setImage(newImage);
		})();
	}

	function internalRequestAddImage() {
		requestAddImage(image);
	}

	function handleAddImageSuccess() {
		EventEmitter.emit("success", "SUCCESSFULLY ADDED NEW IMAGE!");
		navigate("/");
	}

	if (userData === undefined) {
		return (
			<Page>
				<ResponsivePlainLogoHero device={device} />
			</Page>
		);
	}

	if (userData === false) {
		EventEmitter.emit(
			"error",
			"YOU MUST BE SIGNED IN TO ADD A NEW IMAGE. PLEASE SIGN IN AND TRY AGAIN"
		);
		return (
			<Page>
				<ResponsivePlainLogoHero device={device} />
				<div
					style={{
						width: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<RotatingImage
						src="/orang.png"
						width="500px"
						alt="you are not signed in"
					/>
				</div>
			</Page>
		);
	}

	return (
		<Page>
			<ResponsivePlainLogoHero device={device} />
			<div style={{ textAlign: "center", marginBottom: "-4px" }}>
				<ResponsiveDescription device={device}>
					NEW IMAGE PREVIEW
				</ResponsiveDescription>
			</div>
			<CenteredColumnContainer>
				<ResponsiveAddImagePreview
					device={device}
					userData={userData}
					image={image}
					time={PreviewConstants.previewData.time}
					points={PreviewConstants.previewData.points}
					likes={PreviewConstants.previewData.likes}
					dislikes={PreviewConstants.previewData.dislikes}
					captions={PreviewConstants.previewCaptions}
					requestAddImage={internalRequestAddImage}
					requestChangeImage={requestChangeImage}
					accImageInputTypes={accImageInputTypes}
				/>
			</CenteredColumnContainer>
		</Page>
	);
}

export default AddImage;
