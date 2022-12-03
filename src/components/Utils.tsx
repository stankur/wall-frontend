import React, { Children, ReactElement, ReactNode, useState } from "react";
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
		${desktopConstants.background[0]},
		${desktopConstants.background[1]},
		${desktopConstants.background[2]}
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

interface ButtonProps extends Pick<ColorButtonProps, "fontSize">{
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
	font-weight: bold;
	font-size: ${desktopConstants.largeFontSize};
	text-shadow: 2px 2px 9px rgba(0, 0, 0, 0.25);
	padding-bottom: ${desktopConstants.bigGap};
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

const MobileBackgroundColorButtonContainer = styled(BackgroundColorButtonContainer)`
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

};



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
    CircleButton
};

export {
	ResponsiveDescription,
	ResponsiveWhiteButton,
	ResponsiveBackgroundColorButton,
};

export type { ResponsiveDescriptionProps };