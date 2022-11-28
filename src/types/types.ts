export type Device = "desktop" | "tablet" | "mobile";

type ExpandedPostParams = {
	id: string;
};

export type { ExpandedPostParams };
// interfaces resulted from fetching backend (must align with backend):

export interface AppState {
	currentRound: number;
	currentRoundFinish: string;
}

interface PostData {
	id: string;
	user: string;
	username: string;
	created_at: string;
	updated_at: string;
	likes: number;
	dislikes: number;
	points: number;
}

interface CaptionData extends PostData {
	text: string;
	image: string;
}

export interface RankedCaptionData extends CaptionData {
	rank: number;
}

export interface ImageData extends PostData {
	imageUrl: string;
	captions: RankedCaptionData[];
	round?: number;
}

export interface UserData {
	username: string;
	id: string;
}

interface BackendGeneratedError {
	error: {
		message: string;
	};
}

type AuthenticationError = {
	error: {
		message: "YOU ARE NOT SIGNED IN";
	};
};

function isAuthenticationError(
	err: BackendGeneratedError
): err is AuthenticationError {
	return err.error.message === "YOU ARE NOT SIGNED IN";
}

export { isAuthenticationError };

export interface AddImageResponse {
	id: string;
}

export interface AddCaptionResponse {
	id: string;
}

export type PostType = "caption" | "image";
export type Interaction = "like" | "dislike" | null;

interface WithInteraction {
	interaction: Interaction;
}

interface PostDataWithInteractions extends PostData, WithInteraction {}
export interface RankedCaptionDataWithInteractions
	extends RankedCaptionData,
		WithInteraction {}

export interface ImageDataWithInteractions extends PostDataWithInteractions {
	imageUrl: string;
	captions: RankedCaptionDataWithInteractions[];
	reound?: number;
}

export interface VoteCaptionResponse {
	id: string;
}
