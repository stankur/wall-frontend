import React, {ReactElement} from "react";
import styled from "styled-components";

const constants = {
    background : [228, 228, 228],
    radius: "7px",
    regularFontSize: "13px",
    smallFontSize: "11px",
    largeFontSize: "100px",
    smallGap: "8px",
    smallerGap: "5px",
    verySmallGap: "4px"
}

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
    width: 55%;
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

const PostInfoBarOuterContainer = styled.div`
	padding: ${constants.smallGap};
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

interface NameTimeProps {
    name: string,
    time: string
}

function NameTime({ name, time }: NameTimeProps) {
	return (
		<PostInfoBarOuterContainer>
			<span
				style={{
					fontWeight: "bold",
					fontSize: constants.regularFontSize,
				}}
			>
				{name}
			</span>
			<span style={{ fontWeight: 500, fontSize: constants.regularFontSize}}>{time}</span>
		</PostInfoBarOuterContainer>
	);
}

const PlusButtonContainer = styled.div`
	width: 14px;
	height: 14px;
	border-radius: 50%;
	border: 1px solid black;
	font-size: ${constants.regularFontSize};
    position: relative;
`;

const PlusSignContainer = styled.span`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
    font-weight: bold;
    font-size: large;
`;

function PlusButton() {
    return (
		<PlusButtonContainer>
			<PlusSignContainer>+</PlusSignContainer>
		</PlusButtonContainer>
	);
}

const SmallerGappedContainer = styled.div`
	display: inline-flex;
	align-items: center;
	gap: ${constants.smallerGap};
`;

interface StatsPairProps {
	keyName: string;
	value: string;
}

function StatsPair({keyName, value}: StatsPairProps) {
    return (
		<SmallerGappedContainer>
			<span style={{ fontSize: constants.regularFontSize, fontWeight: 500 }}>
				{keyName}
			</span>
			<span style={{ fontWeight: "bold" }}>{value}</span>
		</SmallerGappedContainer>
	);
}

function StatsPairAndPlusButton({ keyName, value }: StatsPairProps) {
	return (
		<SmallerGappedContainer>
			<PlusButton />
			<StatsPair keyName={keyName} value={value} />
		</SmallerGappedContainer>
	);
} 

interface StatsProps {
    points: number,
    likes: number,
    dislikes: number
}
function Stats({ points, likes, dislikes }: StatsProps) {
	return (
		<PostInfoBarOuterContainer>
			<StatsPair keyName="POINTS" value={points.toString()} />
			<StatsPairAndPlusButton keyName="LIKES" value={likes.toString()} />
			<StatsPairAndPlusButton
				keyName="DISLIKES"
				value={dislikes.toString()}
			/>
		</PostInfoBarOuterContainer>
	);
}

interface ImageSideProps extends StatsProps, NameTimeProps {
	imageUrl: string;
}

const ImageSideContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
`;
function ImageSide({
	name,
	time,
	points,
	likes,
	dislikes,
	imageUrl,
}: ImageSideProps) {
	return (
		<ImageSideContainer>
			<NameTime name={name} time={time} />
			<img alt="post" src={imageUrl} width="100%" />
			<Stats points={points} dislikes={dislikes} likes={likes} />
		</ImageSideContainer>
	);
}

const CaptionContainer = styled.div`
	padding: ${constants.smallGap};
	padding-top: 2px;
`;

interface CaptionProps {
	text: string;
}

function Caption({ text }: CaptionProps) {
	return <CaptionContainer>{text}</CaptionContainer>;
}

const CaptionGroupContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-bottom: 1px solid black;
`

interface CaptionGroupProps {
    text: string;
    name: string;
    time: string;
    points: number;
    likes: number;
    dislikes: number;
}

function CaptionGroup({
	text,
	name,
	time,
	points,
	likes,
	dislikes,
}: CaptionGroupProps) {
	return (
		<CaptionGroupContainer>
			<NameTime name={name} time={time} />
			<Caption text={text} />
			<Stats points={points} likes={likes} dislikes={dislikes} />
		</CaptionGroupContainer>
	);
}

const InnerButtonContainer = styled.div`
	display: inline-block;
	padding: ${constants.verySmallGap};
	border: 1px solid black;
	border-radius: ${constants.radius};
	background-color: rgb(
		${constants.background[0]},
		${constants.background[1]},
		${constants.background[2]}
	);
	font-weight: 500;
	font-size: ${constants.regularFontSize};
`;

interface InnerButtonProps {
	text: string;
}
function InnerButton({ text }: InnerButtonProps) {
	return <InnerButtonContainer>{text}</InnerButtonContainer>;
}

const CaptionOptionsContainer = styled.div`
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
    padding: ${constants.smallerGap};
    gap: ${constants.smallGap};
    /* border-top: 1px solid black; */
    margin-top: -1px;
`

function CaptionOptions() {
	return (
		<CaptionOptionsContainer>
			<InnerButton text="EXPAND" />
			<InnerButton text="ADD CAPTION" />
		</CaptionOptionsContainer>
	);
}

const LogoContainer = styled.span`
	font-weight: bold;
	font-size: ${constants.largeFontSize};
	text-shadow: 2px 2px 9px rgba(0, 0, 0, 0.25);
`;

function Logo() {
	return <LogoContainer>WALL</LogoContainer>
}






export { Page, TwoSidedCard, ImageSide, CaptionGroup, CaptionOptions, Logo };