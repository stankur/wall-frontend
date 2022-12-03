import styled from "styled-components";
import { desktopConstants, mobileConstants } from "../constants/ComponentConstants";
import { Device } from "../types/types";

const EmptyCaptionOuterContainer = styled.div`
	width: 100%;
	flex-grow: 1;

	display: flex;
    flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: ${desktopConstants.smallerGap};
`;


const BoldWatermark = styled.span`
	font-size: ${desktopConstants.regularFontSize};
	color: rgb(
		${desktopConstants.watermark[0]},
		${desktopConstants.watermark[1]},
		${desktopConstants.watermark[2]}
	);
	font-weight: bold;
	cursor: default;
`;

function EmptyCaption() {
	return (
		<EmptyCaptionOuterContainer>
				<BoldWatermark>NO SUGGESTED CAPTION YET</BoldWatermark>
				<BoldWatermark>BE THE FIRST TO SUGGEST</BoldWatermark>
		</EmptyCaptionOuterContainer>
	);
}

const EmptyRoundCardContainer = styled.div`
	width: ${desktopConstants.mainContentWidth};
	height: ${desktopConstants.EmptyRoundCardHeight};

	border: 1px solid black;
	border-radius: ${desktopConstants.radius};
	background-color: white;

	display: flex;
	justify-content: center;
	align-items: center;
`;

const EmptyRoundCardContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${desktopConstants.smallerGap};

    align-items: center;
`;

function EmptyRoundCard() {
	return (
		<EmptyRoundCardContainer>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<img src="./frog.png" width="230px" alt="frog" />
				<EmptyRoundCardContentContainer>
					<BoldWatermark>THIS ROUND IS EMPTY</BoldWatermark>
					<BoldWatermark>BE THE FIRST TO ADD AN IMAGE</BoldWatermark>
				</EmptyRoundCardContentContainer>
			</div>
		</EmptyRoundCardContainer>
	);
}

//////////////////////////////////////////////////////////// MOBILE COMPONENTS ////////////////////////////////////////////////////////////
const MobileBoldWatermark = styled(BoldWatermark)``;

const MobileEmptyCaptionOuterContainer = styled(EmptyCaptionOuterContainer)`
	width: 100%;
	height: ${mobileConstants.emptyCaptionHeight};

    gap: ${mobileConstants.smallerGap};

	border-bottom: 1px solid black;
`;

function MobileEmptyCaption() {
	return (
		<MobileEmptyCaptionOuterContainer>
			<MobileBoldWatermark>NO SUGGESTED CAPTION YET</MobileBoldWatermark>
			<MobileBoldWatermark>BE THE FIRST TO SUGGEST</MobileBoldWatermark>
		</MobileEmptyCaptionOuterContainer>
	);
}

const MobileEmptyRoundCardContainer = styled(EmptyRoundCardContainer)`
	width: ${mobileConstants.mainContentWidth};
	height: ${mobileConstants.emptyRoundCardHeight};
`;

const MobileEmptyRoundCardContentContainer = styled(
	EmptyRoundCardContentContainer
)`
	gap: ${mobileConstants.smallerGap};
`;

function MobileEmptyRoundCard() {
	return (
		<MobileEmptyRoundCardContainer>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<img src="./frog.png" width="220px" alt="frog" />
				<MobileEmptyRoundCardContentContainer>
					<MobileBoldWatermark>
						THIS ROUND IS EMPTY
					</MobileBoldWatermark>
					<MobileBoldWatermark>
						BE THE FIRST TO ADD AN IMAGE
					</MobileBoldWatermark>
				</MobileEmptyRoundCardContentContainer>
			</div>
		</MobileEmptyRoundCardContainer>
	);
}

//////////////////////////////////////////////////////////// RESPONSIVE COMPONENTS ////////////////////////////////////////////////////////////

interface ResponsiveEmptyRoundCardProps {
	device: Device;
}

function ResponsiveEmptyRoundCard({ device }: ResponsiveEmptyRoundCardProps) {
	if (device === "mobile") {
		return <MobileEmptyRoundCard />;
	}

	return <EmptyRoundCard />;
}

export { EmptyCaption };

export { MobileEmptyCaption };

export { ResponsiveEmptyRoundCard };
