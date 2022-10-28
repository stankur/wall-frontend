import React, {ReactElement, useState} from "react";
import styled, { keyframes} from "styled-components";
import { EventEmitter } from "../Utils";
import constants from "../constants/ComponentConstants";

const Page = styled.div`
	width: 100vw;
	min-height: 100vh;
	box-sizing: border-box;
	background-color: rgb(
		${constants.background[0]},
		${constants.background[1]},
		${constants.background[2]}
	);
`;
const OuterContainer = styled.div`
	background-color: white;
	border: 1px solid black;
	border-radius: ${constants.radius};
	display: inline-flex;
	flex-direction: row;
    width: ${constants.mainContentWidth};
`;

interface SideContainerProps {
    proportion: number
}

const LeftContainer = styled.div<SideContainerProps>`
	display: inline-flex;
	flex-direction: column;
	border: 1px solid black;
	border-top-left-radius: ${constants.radius};
	border-bottom-left-radius: ${constants.radius};
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
	border-top-right-radius: ${constants.radius};
	border-bottom-right-radius: ${constants.radius};
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
		<OuterContainer >
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
}

const BackgroundColorButtonContainer = styled.button<ColorButtonProps>`
	display: inline-block;
	padding: ${constants.verySmallGap};
	border: 1px solid black;
	border-radius: ${constants.radius};
	background-color: rgb(
		${(props) => props.r},
		${(props) => props.g},
		${(props) => props.b}
	);
	font-weight: 500 !important;
	font-family: roboto;
	font-size: ${constants.regularFontSize};
`;

interface ButtonProps {
	text: string;
    onClick?: React.MouseEventHandler
}
function BackgroundColorButton({ text, onClick }: ButtonProps) {
	return (
		<BackgroundColorButtonContainer
			r={constants.background[0]}
			g={constants.background[1]}
			b={constants.background[2]}
			onClick={onClick}
		>
			{text}
		</BackgroundColorButtonContainer>
	);
}

function WhiteButton({ text, onClick }: ButtonProps) {
	return (
		<BackgroundColorButtonContainer
			r={255}
			g={255}
			b={255}
			onClick={onClick}
		>
			{text}
		</BackgroundColorButtonContainer>
	);
}

const CenteredColumnContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${constants.enormousGap};
	align-items: center;
`;

const LogoContainer = styled.span`
	font-weight: bold;
	font-size: ${constants.largeFontSize};
	text-shadow: 2px 2px 9px rgba(0, 0, 0, 0.25);
	padding-bottom: ${constants.bigGap};
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
	font-size: ${constants.mediumFontSize};
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
	padding-bottom: ${constants.bigGap};
	text-align: left;
	font-size: ${constants.regularFontSize};
	width: ${constants.mainContentWidth};
`;


export {
	Page,
	TwoSidedCard,
	CenteredColumnContainer,
	WhiteButton,
	BackgroundColorButton,
	LogoContainer,
	LoaderDiv,
    Description
};