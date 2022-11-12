function getDimensions(
	dataURL: string
): Promise<{ height: number; width: number }> {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			resolve({
				height: img.height,
				width: img.width,
			});
		};
		img.src = dataURL;
	});
}

const minAccAspectRatio = 0.8;
const maxAccAspectRatio = 1.91;

const constants = {
	minAccAspectRatio,
	maxAccAspectRatio,
	isDimensionValid: async function (dataURL: string) {
		let dimensions = await getDimensions(dataURL);
		let aspectRatio = dimensions.width / dimensions.height;
		return (
			aspectRatio >= minAccAspectRatio && aspectRatio <= maxAccAspectRatio
		);
	},
	accImageInputTypes: "image/jpeg, image/jpg",
};

export default constants;
