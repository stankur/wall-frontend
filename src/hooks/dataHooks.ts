import { useEffect, useState } from "react";
import { errorHandlingFetch, EventEmitter } from "../Utils";
import AuthenticationConstants from "../constants/AuthenticationConstants";
import { AppState, ImageData, ImageDataWithInteractions } from "../types/types";

function useFetchingImages(): [undefined | ImageData[] |ImageDataWithInteractions[], boolean, () => void] {
	const [images, setImages] = useState<
		undefined | ImageData[] | ImageDataWithInteractions[]
	>(undefined);
	const [fetchingImages, setFetchingImages] = useState(true);

	useEffect(function () {
		(async function () {
			if (fetchingImages) {
				let response = await errorHandlingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/images",
					{
						...AuthenticationConstants.requiredConfig,
					},
					handleFetchImagesError
				);

				if (response && !response.error) {
					console.log(JSON.stringify(response.images));
					setImages(response.images);
				}

				return setFetchingImages(false);
			}
		})();
	});

	function handleFetchImagesError(err: Error) {
		EventEmitter.emit("error", err.message);
		return setImages(undefined);
	}

	function requestFetchImages() {
		if (!fetchingImages) {
			return setFetchingImages(true);
		}
	}

	return [images, fetchingImages, requestFetchImages];
}

function useFetchingImage(
	id: string
): [ImageData | ImageDataWithInteractions| undefined, boolean, () => void] {
	const [image, setImage] = useState<
		undefined | ImageData | ImageDataWithInteractions
	>(undefined);
	const [fetchingImage, setFetchingImage] = useState(true);

	useEffect(function () {
		(async function () {
			if (fetchingImage) {
				let response = await errorHandlingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/images/" +
						id,
					{
						...AuthenticationConstants.requiredConfig,
					},
					handleFetchImageError
				);

				if (response && !response.error) {
					console.log(JSON.stringify(response.image));
					setImage(response.image);
				}

				return setFetchingImage(false);
			}
		})();
	});

	function handleFetchImageError(err: Error) {
		EventEmitter.emit("error", err.message);
		return setImage(undefined);
	}

	function requestFetchImage() {
		if (!fetchingImage) {
			return setFetchingImage(true);
		}
	}

	return [image, fetchingImage, requestFetchImage];
}
function useFetchingRoundData(): [AppState | undefined, () => void] {
	const [roundData, setRoundData] = useState<AppState | undefined>(undefined);
	const [fetchingRoundData, setFetchingRoundData] = useState(true);

	useEffect(function () {
		(async function () {
			if (fetchingRoundData) {
				let response = await errorHandlingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/state/current-round",
					{
						...AuthenticationConstants.requiredConfig,
					},
					handleFetchRoundDataError
				);

				if (response && !response.error) {
					setRoundData(response);
				}
			}

			return setFetchingRoundData(false);
		})();
	});

	function handleFetchRoundDataError() {
		EventEmitter.emit(
			"error",
			"WE HAVE NETWORK ISSUE WHILE TRYING TO GET CURRENT ROUND'S DATA. PLEASE TRY AGAIN IN A WHILE"
		);
	}

	function requestFetchRoundData() {
		if (!fetchingRoundData) {
			return setFetchingRoundData(true);
		}
	}

	return [roundData, requestFetchRoundData];
}

export { useFetchingImages, useFetchingImage, useFetchingRoundData };
