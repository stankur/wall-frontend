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
}

// interfaces resulted from fetching backend (must align with backend):

export interface UserData {
	username: string;
	id: string;
}

interface BackendGeneratedError {
    error: {
        message: string;
    }
}

type AuthenticationError = {
	error: {
		message: "YOU ARE NOT SIGNED IN";
	};
};

function isAuthenticationError(
	err: BackendGeneratedError
): err is AuthenticationError {
    console.log(err.error.message);
	return err.error.message === "YOU ARE NOT SIGNED IN";
}

export { isAuthenticationError };
