import dayjs from "dayjs";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useInternalUserData } from "../App";
import { LogoHero } from "../components/Hero";
import { AddImagePreview } from "../components/ImageCaptions";
import {
	CenteredColumnContainer,
	Description,
	Page,
} from "../components/Utils";
import { useAddImage } from "../hooks/imageHooks";
import ImageConstants from "../constants/ImageConstants";
import PreviewConstants from "../constants/PreviewConstants";
import { EventEmitter } from "../Utils";

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
	const [addingImage, requestAddImage] = useAddImage(
		userData,
		setUserData,
		handleAddImageSuccess
	);
	const navigate = useNavigate();

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
				<LogoHero />
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
				<LogoHero />
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
			<LogoHero />
			<div style={{ textAlign: "center", marginBottom: "-4px" }}>
				<Description>NEW IMAGE PREVIEW</Description>
			</div>
			<CenteredColumnContainer>
				<AddImagePreview
                    id={""}
					userData={userData}
					image={image}
					time={PreviewConstants.previewData.time}
					points={PreviewConstants.previewData.points}
					likes={PreviewConstants.previewData.likes}
					dislikes={PreviewConstants.previewData.dislikes}
					captions={PreviewConstants.previewCaptions}
					requestAddImage={internalRequestAddImage}
					requestChangeImage={requestChangeImage}
				/>
			</CenteredColumnContainer>
		</Page>
	);
}

export default AddImage;
