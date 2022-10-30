import { useEffect, useState } from "react";
import { errorHandlingFetch } from "../Utils";
import AuthenticationConstants from "../constants/AuthenticationConstants";
import { ImageData } from "../types/types";

function useFetchingImage(): [undefined | ImageData[], boolean, () => void] {
	const [images, setImages] = useState<undefined | ImageData[]>(undefined);
	const [fetchingImages, setFetchingImages] = useState(true);

	useEffect(function () {
		(async function () {
			if (fetchingImages) {
				let response = await errorHandlingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/images",
					{
						...AuthenticationConstants.requiredConfig,
					}
				);

				if (response && response.error) {
					setImages(undefined);
				}

				if (response && !response.error) {
					setImages(response.images);
				}

				return setFetchingImages(false);
			}
		})();
	});

	function requestFetchImages() {
		if (!fetchingImages) {
			return setFetchingImages(true);
		}
	}

	return [images, fetchingImages, requestFetchImages];
}

export default useFetchingImage;
