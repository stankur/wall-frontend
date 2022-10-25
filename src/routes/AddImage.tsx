import dayjs from "dayjs";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useInternalUserData } from "../App";
import { LogoHero } from "../components/Hero";
import { AddImagePreview } from "../components/ImageCaptions";
import {
	CenteredColumnContainer,
	Description,
	Page,
} from "../components/Utils";
import { RankedCaptionData, UserData } from "../types/types";
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
	const [imageUrl, setImageUrl] = useState<string | false>(false);
	const previewData = {
		time: dayjs().subtract(10, "minutes").format(),
		points: 25,
		likes: 30,
		dislikes: 5,
	};

	const previewCaptions: RankedCaptionData[] = [
		{
			id: "f7bed58d-f594-4acc-8766-6fbc048335a0",
			text: "This will be someone's suggestion of a caption.",
			user: "SOMEONE",
			username: "SOMEONE",
			image: "d72f345e-27d5-4143-b76b-ba080bf62ba7",
			created_at: dayjs().subtract(5, "minutes").format(),
			updated_at: dayjs().subtract(5, "minutes").format(),
			likes: 3,
			dislikes: 0,
			points: 3,
			rank: 1,
		},
		{
			id: "926b0e63-cd4e-4523-a2e2-b8155037ad41",
			text: "This will be someone's suggestion of a caption.",
			user: "SOMEONE",
			username: "SOMEONE",
			image: "d72f345e-27d5-4143-b76b-ba080bf62ba7",
			created_at: dayjs().subtract(5, "minutes").format(),
			updated_at: dayjs().subtract(5, "minutes").format(),
			likes: 3,
			dislikes: 0,
			points: 3,
			rank: 2,
		},
		{
			id: "d1e463e6-94b6-428b-9c03-e29408cca093",
			text: "This will be someone's suggestion of a caption.",
			user: "SOMEONE",
			username: "SOMEONE",
			image: "d72f345e-27d5-4143-b76b-ba080bf62ba7",
			created_at: dayjs().subtract(5, "minutes").format(),
			updated_at: dayjs().subtract(5, "minutes").format(),
			likes: 2,
			dislikes: 0,
			points: 2,
			rank: 3,
		},
	];

	function requestAddImage() {}

	function requestChangeImage(newImageUrl: string | false) {
        return setImageUrl(newImageUrl)
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
					userData={userData}
					imageUrl={imageUrl}
					time={previewData.time}
					points={previewData.points}
					likes={previewData.likes}
					dislikes={previewData.dislikes}
					captions={previewCaptions}
					requestAddImage={requestAddImage}
					requestChangeImage={requestChangeImage}
				/>
			</CenteredColumnContainer>
		</Page>
	);
}

export default AddImage;