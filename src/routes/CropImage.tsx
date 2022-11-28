import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ResponsivePlainLogoHero } from "../components/Hero";
import {
	CenteredColumnContainer,
	Description,
	MobileDescription,
	Page,
	ResponsiveDescription,
	ResponsiveDescriptionProps,
	ResponsiveWhiteButton,
} from "../components/Utils";

import { desktopConstants, mobileConstants } from "../constants/ComponentConstants";
import ImageConstants from "../constants/ImageConstants";
import { DeviceContext } from "../hooks/deviceHooks";

import styled from "styled-components";
import { Area } from "react-easy-crop/types";
import ImageCropper from "../components/ImageCropper";
import { EventEmitter } from "../Utils";

async function cropImage(
	imageSrc: string,
	croppedAreaPixels: Area
): Promise<Blob | null> {
	let image: HTMLImageElement = await ImageConstants.createImage(imageSrc);

	const canvas = document.createElement("canvas");
	const canvasContext = canvas.getContext("2d");

	if (!canvasContext) {
		return null;
	}

    canvas.width = image.width;
	canvas.height = image.height;


	canvasContext.drawImage(image, 0, 0);

	let data: ImageData = canvasContext.getImageData(
		croppedAreaPixels.x,
		croppedAreaPixels.y,
		croppedAreaPixels.width,
		croppedAreaPixels.height
	);

    canvas.width = croppedAreaPixels.width;
	canvas.height = croppedAreaPixels.height;

	canvasContext.putImageData(data, 0, 0);

	return new Promise((resolve, reject) => {
		canvas.toBlob((file) => {
			if (file) {
				return resolve(file);
			}
			return reject("file is null");
		}, "image/jpeg");
	});
}

const CropImageDescription = styled(Description)`
	width: ${desktopConstants.CropperContainerSize}; 
`;

const MobileCropImageDescription = styled(MobileDescription)`
	width: ${mobileConstants.CropperContainerSize};
`;

function ResponsiveCropImageDescription({
	device,
	children,
}: ResponsiveDescriptionProps) {
	if (device === "mobile") {
		return (
			<MobileCropImageDescription>{children}</MobileCropImageDescription>
		);
	}

	return <CropImageDescription>{children}</CropImageDescription>;
}

const CropImageDescriptionEnd = styled(CropImageDescription)`
	display: inline-flex;
	justify-content: flex-end;
`;

const MobileCropImageDescriptionEnd = styled(MobileCropImageDescription)`
	display: inline-flex;
	justify-content: flex-end;
`;

function ResponsiveCropImageDescriptionEnd({
	device,
	children,
}: ResponsiveDescriptionProps) {
	if (device === "mobile") {
		return (
			<MobileCropImageDescriptionEnd>
				{children}
			</MobileCropImageDescriptionEnd>
		);
	}

	return <CropImageDescriptionEnd>{children}</CropImageDescriptionEnd>;
}

function CropImage() {
	const device = useContext(DeviceContext);

	const navigate = useNavigate();
	const location = useLocation();

	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
		null
	);

	function getImageUrl() {
		if (!location.state) {
			return false;
		}

		if (
			!location.state.imageUrl ||
			typeof location.state.imageUrl !== "string"
		) {

			return false;
		}

		return location.state.imageUrl;
	}

	async function requestPreview() {
		if (croppedAreaPixels) {
			let croppedImage: Blob | null;
			try {
				croppedImage = await cropImage(
					getImageUrl(),
					croppedAreaPixels
				);

				if (croppedImage === null) {
					return EventEmitter.emit(
						"error",
						"SORRY, YOUR BROWSER DOESN'T SUPPORT OUR CROPPING TOOL. PLEASE CHANGE TO A DIFFERENT BROWSER OR CHANGE IMAGE WITH SMALLER ASPECT RATIO."
					);
				}
				return navigate("/add-image", {
					state: {
						croppedImage,
					},
				});
			} catch (err) {
				return EventEmitter.emit("error", (err as Error).message);
			}
		}

		return EventEmitter.emit(
			"error",
			"PLEASE MOVE IMAGE WITH CROP PANEL TO CONFIRM CURRENT POSITION"
		);
	}

	return (
		<Page>
			<ResponsivePlainLogoHero device={device} />
			{!getImageUrl() ? (
				<div style={{ textAlign: "center" }}>
					NO IMAGE HAS BEEN PROVIDED. IF YOU BELIEVE THIS IS AN ERROR,
					PLEASE SEND US A MESSAGE.
				</div>
			) : (
				<>
					<div style={{ textAlign: "center" }}>
						<ResponsiveCropImageDescription device={device}>
							CROP IMAGE
						</ResponsiveCropImageDescription>
					</div>
					<CenteredColumnContainer>
						<ImageCropper
							imageUrl={getImageUrl()}
							setCroppedAreaPixels={setCroppedAreaPixels}
						/>
					</CenteredColumnContainer>
					<div style={{ textAlign: "center" }}>
						<ResponsiveCropImageDescriptionEnd device={device}>
							<ResponsiveWhiteButton
								device={device}
								text="PREVIEW"
								onClick={requestPreview}
							/>
						</ResponsiveCropImageDescriptionEnd>
					</div>
				</>
			)}
		</Page>
	);
}

export default CropImage;
