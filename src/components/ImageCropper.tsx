import React, { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import styled from "styled-components";
import { desktopConstants } from "../constants/ComponentConstants";
import ImageConstants from "../constants/ImageConstants";

import { Point, Area } from "react-easy-crop/types";

const CropperContainer = styled.div`
	width: ${desktopConstants.CropperContainerSize};
	height: ${desktopConstants.CropperContainerSize};
	position: relative;
`;

type ObjectFitValue = "horizontal-cover" | "vertical-cover";

interface ImageCropperProps {
	imageUrl: string;
	setCroppedAreaPixels: React.Dispatch<React.SetStateAction<Area | null>>;
}

function ImageCropper({ imageUrl, setCroppedAreaPixels }: ImageCropperProps) {
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);

	const [settingObjectFit, setSettingObjectFit] = useState(true);
	const [objectFit, setObjectFit] = useState<ObjectFitValue | undefined>(
		undefined
	);

	useEffect(function () {
		(async function () {
			if (settingObjectFit) {
				let newObjectFit = await getObjectFit(imageUrl);
				setObjectFit(newObjectFit);
				return setSettingObjectFit(false);
			}
		})();
	});

	async function getObjectFit(imageUrl: string): Promise<ObjectFitValue> {
		let dimensions = await ImageConstants.getDimensions(imageUrl);

		let width = dimensions.width;
		let height = dimensions.height;

		if (height > width) {
			return "horizontal-cover";
		}

		return "vertical-cover";
	}

	const onCropComplete = useCallback(
		(croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[setCroppedAreaPixels]
	);

	if (objectFit === undefined) {
		return <div />;
	}

	return (
		<CropperContainer>
			<Cropper
				image={imageUrl}
				crop={crop}
				zoom={zoom}
				onCropChange={setCrop}
				onZoomChange={setZoom}
				aspect={1}
				objectFit={objectFit}
				onCropComplete={onCropComplete}
			/>
		</CropperContainer>
	);
}

export default ImageCropper;
