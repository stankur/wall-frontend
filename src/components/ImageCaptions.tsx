import React from "react";
import styled from "styled-components";
import constants from "./constants";
import { WhiteButton, TwoSidedCard } from "./Utils";
import { ImageData, RankedCaptionData } from "../types/types";
import { convertTimeToElapsedTime, immutableSortRank } from "./helper";
import {v4 as uuid} from "uuid"

const PostInfoBarOuterContainer = styled.div`
	padding: ${constants.smallGap};
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

interface NameTimeProps {
	name: string;
	time: string;
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
				{name.toUpperCase()}
			</span>
			<span
				style={{ fontWeight: 500, fontSize: constants.regularFontSize }}
			>
				{time}
			</span>
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
	z-index: 1;
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

function StatsPair({ keyName, value }: StatsPairProps) {
	return (
		<SmallerGappedContainer style={{ alignItems: "baseline" }}>
			<span
				style={{ fontSize: constants.regularFontSize, fontWeight: 500 }}
			>
				{keyName}
			</span>
			<span style={{ fontWeight: "bold" }}>{value}</span>
		</SmallerGappedContainer>
	);
}

function StatsPairAndPlusButton({ keyName, value }: StatsPairProps) {
	return (
		<SmallerGappedContainer>
			<span style={{ position: "relative", top: "1px" }}>
				<PlusButton />
			</span>
			<StatsPair keyName={keyName} value={value} />
		</SmallerGappedContainer>
	);
}

interface StatsProps {
	points: number;
	likes: number;
	dislikes: number;
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

const SideContainer = styled.div`
	width: 100%;
    height: 100%;
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
		<SideContainer>
			<NameTime name={name} time={time} />
			<img alt="post" src={imageUrl} width="100%" />
			<Stats points={points} dislikes={dislikes} likes={likes} />
		</SideContainer>
	);
}

const CaptionContainer = styled.div`
	padding: ${constants.smallGap};
	padding-top: 2px;
	text-align: left;
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
`;

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

const AddCaptionContainer = styled.div`
	display: flex;
	align-items: flex-end;
	padding: ${constants.smallerGap};
	gap: ${constants.smallerGap};
	background-color: rgb(
		${constants.background[0]},
		${constants.background[1]},
		${constants.background[2]}
	);
	border-top: 1px solid black;
	border-bottom-right-radius: ${constants.radius};
	margin-top: -1px;
`;

const TextAreaContainer = styled.div`
	display: inline-flex;
	flex-direction: column;
	height: 100%;
	flex-grow: 1;
`;

const CaptionTextArea = styled.textarea`
	flex-grow: 1;
	flex-basis: 0;
	resize: none;
	outline: none;
	border: 1px solid black;
	border-radius: ${constants.radius};
	font-family: roboto;
`;

interface AddCaptionPanelProps {
	onClick: React.MouseEventHandler;
}

function AddCaptionPanel({ onClick }: AddCaptionPanelProps) {
	return (
		<AddCaptionContainer>
			<TextAreaContainer>
				<CaptionTextArea />
			</TextAreaContainer>
			<WhiteButton text="ADD CAPTION" onClick={onClick} />
		</AddCaptionContainer>
	);
}
interface CaptionGroupsProps {
	captions: RankedCaptionData[];
}
function CaptionGroups({ captions }: CaptionGroupsProps) {
	return (
		<div
			style={{
				flexBasis: 0,
				flexGrow: 1,
				overflow: "scroll",
			}}
		>
			{immutableSortRank(captions).map(function (caption) {
				return (
					<CaptionGroup
						name={caption.username.toUpperCase()}
						time={convertTimeToElapsedTime(caption.created_at)}
						text={caption.text}
						points={caption.points}
						likes={caption.likes}
						dislikes={caption.dislikes}
					/>
				);
			})}
		</div>
	);
}


function CaptionsSide({ captions }: CaptionGroupsProps) {
	return (
		<SideContainer>
			<CaptionGroups captions={captions} />
			<AddCaptionPanel onClick={() => {}} />
		</SideContainer>
	);
}

interface ImageCaptionsCardProps {
	data: ImageData;
}

function ImageCaptionsCard({data}: ImageCaptionsCardProps) {
	return (
		<TwoSidedCard
			left={
				<ImageSide
					name={data.username}
					time={convertTimeToElapsedTime(data.created_at)}
					points={data.points}
					likes={data.likes}
					dislikes={data.dislikes}
					imageUrl={data.imageUrl}
				/>
			}
			right={<CaptionsSide captions={data.captions} />}
		/>
	);
}

export { ImageCaptionsCard };
