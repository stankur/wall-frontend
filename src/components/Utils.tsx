import React, { Children, ReactElement, ReactFragment, ReactNode, useState } from "react";
import styled, { keyframes } from "styled-components";
import { EventEmitter } from "../Utils";
import {
	desktopConstants,
	mobileConstants,
} from "../constants/ComponentConstants";
import { Device } from "../types/types";

const Page = styled.div`
	width: 100vw;
	min-height: 100vh;
	box-sizing: border-box;
	background-color: rgb(
		${desktopConstants.backgroundDarker[0]},
		${desktopConstants.backgroundDarker[1]},
		${desktopConstants.backgroundDarker[2]}
	);
	padding-bottom: ${desktopConstants.EnormousGap};
`;
const OuterContainer = styled.div`
	background-color: white;
	border: 1px solid black;
	border-radius: ${desktopConstants.radius};
	display: inline-flex;
	flex-direction: row;
	width: ${desktopConstants.mainContentWidth};
	overflow: hidden;
`;

interface SideContainerProps {
	proportion: number;
}

const LeftContainer = styled.div<SideContainerProps>`
	display: inline-flex;
	flex-direction: column;
	border: 1px solid black;
	border-top-left-radius: ${desktopConstants.radius};
	border-bottom-left-radius: ${desktopConstants.radius};
	margin: -1px;
	margin-right: 0px;
	box-sizing: border-box;
	flex-grow: ${(props) => props.proportion};
	flex-basis: 0;
`;

const RightContainer = styled.div<SideContainerProps>`
	display: inline-flex;
	flex-direction: column;
	border: 1px solid black;
	border-left: none;
	border-top-right-radius: ${desktopConstants.radius};
	border-bottom-right-radius: ${desktopConstants.radius};
	margin: -1px;
	margin-left: 0px;
	box-sizing: border-box;
	flex-grow: ${(props) => props.proportion};
	flex-basis: 0;
`;

interface TwoSidedCardProps {
	left: ReactElement;
	right: ReactElement;
	leftProportion?: number;
	rightProportion?: number;
}

const TwoSidedCard = function ({
	left,
	right,
	leftProportion = 1,
	rightProportion = 1,
}: TwoSidedCardProps) {
	if (leftProportion < 0 || rightProportion < 0) {
		throw new Error(
			`either the left or right proportion in a two sided card component is given as negative`
		);
	}
	return (
		<OuterContainer>
			<LeftContainer proportion={leftProportion}>{left}</LeftContainer>
			<RightContainer proportion={rightProportion}>
				{right}
			</RightContainer>
		</OuterContainer>
	);
};

interface ColorButtonProps extends React.ComponentPropsWithoutRef<"button"> {
	r: number;
	g: number;
	b: number;
	fontSize?: string;
}

const BackgroundColorButtonContainer = styled.button<ColorButtonProps>`
	display: inline-block;
	padding: ${desktopConstants.verySmallGap};
	border: 1px solid black;
	border-radius: ${desktopConstants.radius};
	background-color: rgb(
		${(props) => props.r},
		${(props) => props.g},
		${(props) => props.b}
	);
	font-weight: 500 !important;
	font-family: roboto;
	font-size: ${function (props) {
		if (props.fontSize) {
			return props.fontSize;
		}
		return desktopConstants.regularFontSize;
	}};
	white-space: nowrap;
	cursor: pointer;
`;

interface ButtonProps extends Pick<ColorButtonProps, "fontSize"> {
	text: string;
	onClick?: React.MouseEventHandler;
}
function BackgroundColorButton({ text, onClick, fontSize }: ButtonProps) {
	return (
		<BackgroundColorButtonContainer
			r={desktopConstants.background[0]}
			g={desktopConstants.background[1]}
			b={desktopConstants.background[2]}
			onClick={onClick}
			fontSize={fontSize}
		>
			{text}
		</BackgroundColorButtonContainer>
	);
}

function WhiteButton({ text, onClick, fontSize }: ButtonProps) {
	return (
		<BackgroundColorButtonContainer
			r={255}
			g={255}
			b={255}
			onClick={onClick}
			fontSize={fontSize}
		>
			{text}
		</BackgroundColorButtonContainer>
	);
}

const CenteredColumnContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${desktopConstants.enormousGap};
	align-items: center;
`;

const LogoContainer = styled.span`
	font-weight: 800;
	font-size: ${desktopConstants.largeFontSize};
	text-shadow: 2px 2px 9px rgba(0, 0, 0, 0.25);
	padding-bottom: ${desktopConstants.bigGap};
`;

const GradientContainer = styled.div`
	background-image: linear-gradient(
		to right,
		rgb(
			${desktopConstants.igPink[0]},
			${desktopConstants.igPink[1]},
			${desktopConstants.igPink[2]}
		),
		rgb(
			${desktopConstants.igYellow[0]},
			${desktopConstants.igYellow[1]},
			${desktopConstants.igYellow[2]}
		)
	);
`;

const LoaderOpacityAnimation = keyframes`
    from {
        opacity: 0.2
    }

    to {
        opacity: 0.5
    }
`;

const LoaderContainer = styled(LogoContainer)`
	font-size: ${desktopConstants.mediumFontSize};
	padding-bottom: 0;
	animation: ${LoaderOpacityAnimation} 1s ease-in-out infinite alternate;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

function LoaderDiv() {
	return (
		<div style={{ width: "100%", height: "100%", position: "relative" }}>
			<LoaderContainer>WALL</LoaderContainer>
		</div>
	);
}

// for pages which consists of only one two-sided card and needs a small description on top of the card
const Description = styled.div`
	display: inline-block;
	padding-bottom: ${desktopConstants.bigGap};
	padding-top: ${desktopConstants.bigGap};
	text-align: left;
	font-size: ${desktopConstants.regularFontSize};
	width: ${desktopConstants.mainContentWidth};
`;

const LongButton = styled.div`
	display: inline-flex;
	justify-content: flex-start;
	align-items: center;

	gap: ${desktopConstants.smallGap};

	border: 1px solid black;
	border-radius: ${desktopConstants.radius};
	background-color: rgb(
		${desktopConstants.backgroundLite[0]},
		${desktopConstants.backgroundLite[1]},
		${desktopConstants.backgroundLite[2]}
	);
	width: 100%;
	padding: ${desktopConstants.smallerGap};

	box-sizing: border-box;

	cursor: pointer;
`;

const LongButtonImage = styled.img.attrs(() => {
	return { width: desktopConstants.longButtonImageSize };
})``;

const LongButtonText = styled.span`
    font-size: ${desktopConstants.regularFontSize};
`

const RedirectSuggestionContainer = styled.div`
	display: inline-flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: ${desktopConstants.smallGap};
`;


//////////////////////////////////////////////////////////// MOBILE COMPONENTS ////////////////////////////////////////////////////////////

const MobileOuterContainer = styled(OuterContainer)`
	flex-direction: column;
	width: ${mobileConstants.mainContentWidth};
`;

const MobileTopContainer = styled.div`
	border-bottom: 1px solid black;
	box-sizing: border-box;
`;

interface MobileTwoSidedCardProps {
	top: ReactElement;
	bottom: ReactElement;
}

function MobileTwoSidedCard({ top, bottom }: MobileTwoSidedCardProps) {
	return (
		<MobileOuterContainer>
			<MobileTopContainer>{top}</MobileTopContainer>
			{bottom}
		</MobileOuterContainer>
	);
}

const MobileLoaderContainer = styled(LoaderContainer)`
	font-size: ${mobileConstants.mediumFontSize};
`;

function MobileLoaderDiv() {
	return (
		<div style={{ width: "100%", height: "100%", position: "relative" }}>
			<MobileLoaderContainer>WALL</MobileLoaderContainer>
		</div>
	);
}

const MobileBackgroundColorButtonContainer = styled(
	BackgroundColorButtonContainer
)`
	padding: ${mobileConstants.smallerGap};
	border-radius: ${mobileConstants.innerRadius};
	font-size: ${mobileConstants.regularFontSize};
`;

function MobileBackgroundColorButton({ text, onClick, fontSize }: ButtonProps) {
	return (
		<MobileBackgroundColorButtonContainer
			r={mobileConstants.background[0]}
			g={mobileConstants.background[1]}
			b={mobileConstants.background[2]}
			onClick={onClick}
			fontSize={fontSize}
		>
			{text}
		</MobileBackgroundColorButtonContainer>
	);
}

function MobileWhiteButton({ text, onClick, fontSize }: ButtonProps) {
	return (
		<MobileBackgroundColorButtonContainer
			r={255}
			g={255}
			b={255}
			onClick={onClick}
			fontSize={fontSize}
		>
			{text}
		</MobileBackgroundColorButtonContainer>
	);
}

const MobileLogoContainer = styled(LogoContainer)`
	font-size: ${mobileConstants.largeFontSize};
	padding-top: ${mobileConstants.bigGap};
	padding-bottom: 0;
	box-sizing: border-box;
`;

const MobileDescription = styled(Description)`
	padding-bottom: ${mobileConstants.mediumSmallGap};
	padding-top: ${mobileConstants.mediumSmallGap};
	font-size: ${mobileConstants.regularSmallerFontSize};
	width: ${mobileConstants.mainContentWidth};
`;

interface CircleButtonProps {
	baseColor: [number, number, number];
	colored: boolean;
}
const CircleButton = styled.div<CircleButtonProps>`
	width: ${mobileConstants.buttonSize};
	height: ${mobileConstants.buttonSize};
	background-color: ${(props) =>
		props.colored
			? `rgb(${props.baseColor[0]}, ${props.baseColor[1]}, ${props.baseColor[2]})`
			: "white"};
	border-radius: 50%;
	border: 1px solid black;
`;

const MobileLongButton = styled(LongButton)`
	border-radius: ${mobileConstants.innerRadius};
	gap: ${mobileConstants.smallGap};
    padding: ${mobileConstants.smallGap};
`;

const MobileLongButtonImage = styled.img.attrs(() => {
	return { width: mobileConstants.longButtonImageSize };
})``;

const MobileLongButtonText = styled(LongButtonText)`
	font-size: ${mobileConstants.regularFontSize};
`;

const MobileRedirectSuggestionContainer = styled(RedirectSuggestionContainer)`
	gap: ${mobileConstants.smallGap};
`;


//////////////////////////////////////////////////////////// RESPONSIVE COMPONENTS ////////////////////////////////////////////////////////////

interface ResponsiveDescriptionProps {
	device: Device;
	children?: ReactNode;
}
function ResponsiveDescription({
	device,
	children,
}: ResponsiveDescriptionProps) {
	if (device === "mobile") {
		return <MobileDescription>{children}</MobileDescription>;
	}

	return <Description>{children}</Description>;
}

interface ResponsiveButtonProps extends ButtonProps {
	device: Device;
}

function ResponsiveWhiteButton({
	device,
	text,
	onClick,
}: ResponsiveButtonProps) {
	if (device === "mobile") {
		return <MobileWhiteButton text={text} onClick={onClick} />;
	}

	return <WhiteButton text={text} onClick={onClick} />;
}

function ResponsiveBackgroundColorButton({
	device,
	text,
	onClick,
}: ResponsiveButtonProps) {
	if (device === "mobile") {
		return <MobileBackgroundColorButton text={text} onClick={onClick} />;
	}

	return <BackgroundColorButton text={text} onClick={onClick} />;
}

interface ResponsiveLongButtonProps {
	device: Device;
	children: React.PropsWithChildren<any>;
}



function ResponsiveLongButton({ device, children }: ResponsiveLongButtonProps) {
	if (device === "mobile") {
		return <MobileLongButton>{children}</MobileLongButton>;
	}
	return <LongButton>{children}</LongButton>;
}

interface ResponsiveLongButtonImageProps {
	device: Device;
	src: string;
}

function ResponsiveLongButtonImage({
	device,
	src,
}: ResponsiveLongButtonImageProps) {
	if (device === "mobile") {
		return <MobileLongButtonImage src={src} />;
	}

	return <LongButtonImage src={src} />;
}

interface ResponsiveLongButtonTextProps {
	device: Device;
	text: string;
}

function ResponsiveLongButtonText({
	device,
	text,
}: ResponsiveLongButtonTextProps) {
	if (device === "mobile") {
		return <MobileLongButtonText>{text}</MobileLongButtonText>;
	}

	return <LongButtonText>{text}</LongButtonText>;
}

interface ResponsiveRedirectSuggestionContainerProps {
	device: Device;
	children: ReactNode;
}

function ResponsiveRedirectSuggestionContainer({
	device,
	children,
}: ResponsiveRedirectSuggestionContainerProps) {
	if (device === "mobile") {
		return (
			<MobileRedirectSuggestionContainer>
				{children}
			</MobileRedirectSuggestionContainer>
		);
	}

	return (
		<RedirectSuggestionContainer>{children}</RedirectSuggestionContainer>
	);
}


export {
	Page,
	TwoSidedCard,
	CenteredColumnContainer,
	WhiteButton,
	BackgroundColorButton,
	LogoContainer,
	LoaderDiv,
	Description,
};

export {
	MobileTwoSidedCard,
	MobileLoaderDiv,
	MobileBackgroundColorButton,
	MobileWhiteButton,
	MobileLogoContainer,
	MobileDescription,
	CircleButton,
};

export {
	ResponsiveDescription,
	ResponsiveWhiteButton,
	ResponsiveBackgroundColorButton,
	ResponsiveLongButton,
	ResponsiveLongButtonImage,
	ResponsiveLongButtonText,
	GradientContainer,
	ResponsiveRedirectSuggestionContainer,
};

export type { ResponsiveDescriptionProps };
