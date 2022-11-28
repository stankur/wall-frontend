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
async function isDimensionValid(dataURL: string) {
	let dimensions = await getDimensions(dataURL);
	let aspectRatio = dimensions.width / dimensions.height;
	return aspectRatio >= minAccAspectRatio && aspectRatio <= maxAccAspectRatio;
}

async function createImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.src = url;
	});
}


const minAccAspectRatio = 0.8;
const maxAccAspectRatio = 1.91;

const constants = {
	minAccAspectRatio,
	maxAccAspectRatio,
    createImage,
	isDimensionValid,
	getDimensions,
	accImageInputTypes: "image/jpeg, image/jpg",
};

export default constants;
