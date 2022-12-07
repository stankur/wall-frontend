const crossPlatformConstants = {
	background: [228, 228, 228],
	backgroundLite: [243, 243, 243],
	backgroundDarker: [200, 200, 200],
	error: [255, 173, 173],
	watermark: [180, 180, 180],
	success: [173, 206, 255],
	igPink: [232, 72, 108],
	igYellow: [255, 214, 84],

};

const desktopConstants = {
	...crossPlatformConstants,
	radius: "7px",
	regularLargerSize: "16px",
	regularFontSize: "13px",
	smallFontSize: "11px",
	largeFontSize: "93px",
	mediumFontSize: "40px",
	mediumSmallFontSize: "30px",
	mediumSmallerFontSize: "20px",
    navigationLogoFontSize: "25px",
	humongousGap: "50px",
	EnormousGap: "30px",
	enormousGap: "28px",
    biggerGap: "20px",
	bigGap: "18px",
	mediumGap: "14px",
    mediumSmallerGap: "11px",
	smallGap: "8px",
	smallerGap: "5px",
	verySmallGap: "4px",
    descriptionCardGap:"33px",
	mainContentWidth: "max(55%, 600px)",
	messageFormWidth: "370px",
	loadingBarHeight: "15px",
	loadingButtonHeight: "21px",
	messageFormButtonSize: "50px",
	CropperContainerSize: "max(25vw, 300px)", //align with mainContentWidth
	NoImageContainerHeight: "max(20vw, 300px)", //align with mainContentWidth
	EmptyRoundCardHeight: "340px",
};

const mobileConstants = {
	...crossPlatformConstants,
	outerRadius: "7px",
	innerRadius: "5px",
	regularLargerFontSize: "16px",
	regularFontSize: "14px",
	regularSmallerFontSize: "12px",
	smallFontSize: "11.5px",
	mediumFontSize: "30px",
	mediumSmallFontSize: "25px",
	mediumSmallerFontSize: "20px",
	largeFontSize: "75px",
	buttonSize: "24px",
	CropperContainerSize: "300px", //align with mainContentWidth
	messageFormButtonSize: "42px",
	smallGap: "7px",
	smallerGap: "4px",
	mediumSmallerGap: "9px",
	mediumSmallGap: "11px",
	mediumGap: "15px",
	mediumLargeGap: "25px",
	mediumLargerGap: "40px",
	bigSmallGap: "73px",
	bigGap: "85px",
	descriptionCardGap: "25px",
	mainContentWidth: "300px",
	messageFormWidth: "330px",
	upvoteColor: [199, 235, 255],
	downvoteColor: [255, 181, 176],
	red: [255, 181, 176],
	loadingBarHeight: "14px",
	emptyRoundCardHeight: "380px",
	emptyCaptionHeight: "110px",
};
export { desktopConstants, mobileConstants };
