import React, {ReactElement} from "react";
import styled from "styled-components";
import { EventEmitter } from "../Utils";
import constants from "./constants";

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
    onClick: React.MouseEventHandler
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

const ImagesContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${constants.enormousGap};
	align-items: center;
`;

const QuoteOuterContainer = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    padding: ${constants.humongousGap};
`
const QuoteInnerContainer = styled.div`
	font-size: ${constants.mediumFontSize};
	font-weight: bold;
`;
function Quote() {
	return (
		<QuoteOuterContainer>
			<QuoteInnerContainer>
                LOVE IS TEMPORARY, SHREK IS ETERNAL
            </QuoteInnerContainer>
		</QuoteOuterContainer>
	);
}

const LabeledInputContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: flex-start;
	gap: ${constants.smallerGap};
`;

const BackgroundColorInput = styled.input`
	background-color: rgb(
		${constants.background[0]},
		${constants.background[1]},
		${constants.background[2]}
	);
	border: 1px solid black;
	border-radius: ${constants.radius};
	box-sizing: border-box;
	width: 100%;
	outline: none;
	height: 1.8em;
`;
interface LabeledInputProps {
    name: string
}
function LabeledInput({name}: LabeledInputProps) {
    return (
    <LabeledInputContainer>
        <span style={{fontSize: constants.regularFontSize, fontWeight:"bold"}}>{name}</span>
        <BackgroundColorInput/>
    </LabeledInputContainer>
    )
}
const InputsOuterContainer = styled.div`
	display: flex;
	align-items: center;
	box-sizing: border-box;
    flex-basis: 0;
    flex-grow: 1;
`;
const InputsInnerContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: ${constants.bigGap};
`;

function Inputs() {
	return (
		<InputsOuterContainer>
			<InputsInnerContainer>
				<LabeledInput name="USERNAME" />
				<LabeledInput name="PASSWORD" />
			</InputsInnerContainer>
		</InputsOuterContainer>
	);
}

const InputsGroupOuterContainer = styled.div`
	width: 100%;
	height: 100%;
	padding: ${constants.mediumGap};
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
`;

interface InputsGroupProps {
	onClick: React.MouseEventHandler;
}

function InputsGroup({ onClick }: InputsGroupProps) {
	return (
		<InputsGroupOuterContainer>
			<Inputs />
			<span style={{ alignSelf: "flex-end" }}>
				<BackgroundColorButton onClick={onClick} text="JOIN WALL" />
			</span>
		</InputsGroupOuterContainer>
	);
}
function AuthenticationCard() {
	return (
		<TwoSidedCard
			left={<Quote />}
			right={
				<InputsGroup
					onClick={() => {
						EventEmitter.emit(
							"error",
							"THE ERROR IS WHEN YOUR MOM DECIDED TO GIVE BIRTH TO YOUR STUPID ASS"
						);
					}}
				/>
			}
			leftProportion={2}
			rightProportion={5}
		/>
	);
}


export {
	Page,
	TwoSidedCard,
	ImagesContainer,
	WhiteButton,
    BackgroundColorButton,
	AuthenticationCard,
};