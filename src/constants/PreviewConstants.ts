import { RankedCaptionData } from "../types/types";
import dayjs from "dayjs";

const constants = {
	previewCaptions: [
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
	] as RankedCaptionData[],
	previewData: {
		time: dayjs().subtract(10, "minutes").format(),
		points: 25,
		likes: 30,
		dislikes: 5,
	},
};

export default constants;