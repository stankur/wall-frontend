import React, { useEffect, useState } from "react";
import { UserDataState } from "./authenticationHooks";
import CaptionConstants from "../constants/CaptionConstants";
import AuthenticationConstants from "../constants/AuthenticationConstants";
import { authHandlingFetch, EventEmitter } from "../Utils";
import { AddCaptionResponse } from "../types/types";

function useAddCaption(
	userData: UserDataState,
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>,
	imageId: string,
	successHandler?: (response: AddCaptionResponse) => void,
	failHandler?: (err: Error) => void
): [boolean, (newCaption: string) => void] {
	const [addingCaption, setAddingCaption] = useState(false);
	const [caption, setCaption] = useState("");

	useEffect(function () {
		(async function () {
			if (addingCaption) {
				let response = await authHandlingFetch(
					(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/images/" +
						imageId +
						"/captions",
					setUserData,
					{
						...AuthenticationConstants.requiredConfig,
						headers: {
							"Content-Type": "application/json",
						},
						method: "POST",
						body: JSON.stringify({
							text: caption,
						}),
					},
					failHandler
				);

				if (response && !response.error) {
					if (successHandler) {
						successHandler(response);
					}
				}

				return setAddingCaption(false);
			}
		})();
	});

	function requestAddCaption(newCaption: string) {
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

		if (newCaption.trim().length < CaptionConstants.minChars) {
			return EventEmitter.emit(
				"error",
				`CAPTION MUST BE AT LEAST ${CaptionConstants.minChars} NONEMPTY CHARACTERS`
			);
		}

		if (newCaption.length > CaptionConstants.maxChars) {
			return EventEmitter.emit(
				"error",
				`CAPTION MUST BE AT MOST ${CaptionConstants.maxChars} CHARACTERS`
			);
		}

		setCaption(newCaption);
		setAddingCaption(true);
	}

	return [addingCaption, requestAddCaption];
}

export { useAddCaption };
