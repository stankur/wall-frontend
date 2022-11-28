import React, { useEffect, useState } from "react";
import { Interaction, PostType, VoteCaptionResponse } from "../types/types";
import { authHandlingFetch, EventEmitter } from "../Utils";
import AuthenticationConstants from "../constants/AuthenticationConstants";
import { UserDataState } from "./authenticationHooks";

function useInteract(
	userData: UserDataState,
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>,
	successHandler?: (voteCaptionResponse: VoteCaptionResponse) => void,
	failHandler?: (err: Error) => void
):[boolean, RequestInteractFunction] {
	const [addingInteraction, setAddingInteraction] = useState(false);
	const [postType, setPostType] = useState<PostType>("image");
	const [interactionType, setInteractionType] = useState<Interaction>(null);
	const [postId, setPostId] = useState("");

	useEffect(function () {
		(async function () {
			if (addingInteraction) {
				let endpoint: string = "";

				if (postType === "image") {
					endpoint =
						(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/images/" +
						postId +
						"/interactions";
				} else {
					endpoint =
						(process.env.REACT_APP_BACKEND_URL as string) +
						"/api/captions/" +
						postId +
						"/interactions";
				}

				let response = await authHandlingFetch(
					endpoint,
					setUserData,
					{
						...AuthenticationConstants.requiredConfig,
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							type: interactionType,
						}),
					},
					failHandler
				);

				if (response && !response.error) {
					if (successHandler) {
						successHandler(response);
					}
				}

				return setAddingInteraction(false);
			}
		})();
	});

	function requestInteract(postType: PostType, postId: string) {
		return function (
			prevInteractionType: Interaction,
			newInteractionType: Interaction
		) {
			if (userData === false) {
				return EventEmitter.emit(
					"error",
					"YOU MUST BE SIGNED IN TO INTERACT WITH POSTS"
				);
			}

			if (userData === undefined) {
				return EventEmitter.emit(
					"error",
					"PLEASE TRY AGAIN IN A LITTLE WHILE"
				);
			}

			if (prevInteractionType === newInteractionType) {
				return;
			}

			setPostType(postType);
			setInteractionType(newInteractionType);
			setPostId(postId);
			return setAddingInteraction(true);
		};
	}

	return [addingInteraction, requestInteract];
}

type RequestInteractFunctionGivenPostData = (
	prevInteractionType: Interaction,
	newInteractionType: Interaction
) => void;

type RequestInteractFunction = (
	postType: PostType,
	postId: string
) => RequestInteractFunctionGivenPostData;

export { useInteract };
export type { RequestInteractFunctionGivenPostData, RequestInteractFunction };

