import React, { useEffect, useState } from "react";
import { AddImageResponse } from "../types/types";
import { authHandlingFetch, EventEmitter } from "../Utils";
import { UserDataState } from "./authenticationHooks";
import AuthenticationConstants from "../constants/AuthenticationConstants";
import ImageConstants from "../constants/ImageConstants";

function useAddImage(
	userData: UserDataState,
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>,
	successHandler?: (addImageRespose: AddImageResponse) => void,
	failHandler?: (err: Error) => void
): [boolean, (newImage: File | undefined) => void, string] {
	const [addingImage, setAddingImage] = useState(false);
	const [formData, setFormData] = useState<FormData | undefined>(undefined);

	useEffect(function () {
		(async function () {
			if (addingImage) {
				let response = await authHandlingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/images",
					setUserData,
					{
						...AuthenticationConstants.requiredConfig,
						method: "POST",
						body: formData,
					},
					failHandler
				);

				if (response && !response.error) {
					if (successHandler) {
						successHandler(response);
					}
				}

				return setAddingImage(false);
			}
		})();
	});

	async function requestAddImage(newImage: File | undefined) {
		if (userData === false) {
			return EventEmitter.emit(
				"error",
				"YOU MUST BE SIGNED IN TO ADD AN IMAGE"
			);
		}

		if (userData === undefined) {
			return EventEmitter.emit(
				"error",
				"PLEASE TRY AGAIN IN A LITTLE WHILE"
			);
		}
		if (!newImage) {
			return EventEmitter.emit("error", "YOU MUST CHOOSE AN IMAGE FIRST");
		}

		let imageValid = await ImageConstants.isDimensionValid(
			URL.createObjectURL(newImage)
		);

		if (!imageValid) {
			return EventEmitter.emit(
				"error",
				`IMAGE ASPECT RATIO MUST BE BETWEEN ${ImageConstants.minAccAspectRatio} AND ${ImageConstants.maxAccAspectRatio}`
			);
		}

		let formData: FormData = new FormData();
		formData.append("image", newImage);

		setFormData(formData);
		setAddingImage(true);
	}

	return [addingImage, requestAddImage, ImageConstants.accImageInputTypes];
}

export { useAddImage };
