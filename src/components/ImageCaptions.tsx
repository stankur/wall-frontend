import React, { useState, ReactEventHandler, useRef } from "react";
import styled from "styled-components";
import constants from "../constants/ComponentConstants";
import { WhiteButton, TwoSidedCard, LoaderDiv } from "./Utils";
import { ImageData, RankedCaptionData, UserData } from "../types/types";
import { convertTimeToElapsedTime, immutableSortRank } from "./helper";
import {v4 as uuid} from "uuid"
import { EventEmitter } from "../Utils";

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
				{convertTimeToElapsedTime(time)}
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
    cursor: pointer;
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

interface LoadableImageProps {
	imageUrl: string;
    onClick?: React.MouseEventHandler
}

function useImageLoaded() {
	const [loaded, setLoaded] = useState(false);

	function onLoad() {
		setLoaded(true);
	}

	return [loaded, onLoad];
}

const NoImageContainer = styled.div`
    height: 20vw;
    border-top: 1px solid black;
    border-bottom:1px solid black;
`

interface LoadingImageProps {
	onClick?: React.MouseEventHandler;
}

function LoadingImage({
	onClick = () => {
		return;
	},
}: LoadingImageProps) {
	return (
		<NoImageContainer onClick={onClick}>
			<LoaderDiv />
		</NoImageContainer>
	);
}

function LoadableImage({
	imageUrl,
	onClick = () => {
		return;
	},
}: LoadableImageProps) {
	const [loaded, onLoad] = useImageLoaded();

	return (
		<>
			<img
				alt=""
				src={imageUrl}
				width="100%"
				style={
					loaded
						? {
								borderTop: "1px solid black",
								borderBottom: "1px solid black",
						  }
						: {
								display: "none",
						  }
				}
				onLoad={onLoad as ReactEventHandler<HTMLImageElement>}
				onClick={onClick}
			/>
			{!loaded && <LoadingImage onClick={onClick} />}
		</>
	);
}

interface ImageSideProps
	extends StatsProps,
		NameTimeProps,
		Pick<LoadableImageProps, "imageUrl"> {}

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
			<LoadableImage imageUrl={imageUrl} />
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
						time={caption.created_at}
						text={caption.text}
						points={caption.points}
						likes={caption.likes}
						dislikes={caption.dislikes}
                        key={uuid()}
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
					time={data.created_at}
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
// here and below are the components specifically for add-image route
interface ImagePreviewProps extends Omit<ImageSideProps, "imageUrl"> {
	imageUrl: string | false;
	requestChangeImage: (newImage: File| undefined) => void;
}

function ImagePreview({
	imageUrl,
	requestChangeImage,
	name,
	time,
	points,
	dislikes,
	likes,
}: ImagePreviewProps) {
    const fileInput = useRef<HTMLInputElement>(null);
    const [waitingForInput, setWaitingForInput] = useState(false);

	function popUpFileSelection() {
		console.log("pop up file selection waiting: " + waitingForInput);
		if (!waitingForInput) {
			if (fileInput.current) {
                setWaitingForInput(true);
                setTimeout(() => setWaitingForInput(false), 200)
				fileInput.current.click();
			} else {
				EventEmitter.emit(
					"error",
					"PLEASE TRY AGAIN IN A LITTLE WHILE"
				);
			}
		}
	}

	function handleSelectedFileChange(
		event: React.ChangeEvent<HTMLInputElement>
	) {
		setWaitingForInput(false);

		console.log("handle selected file change waiting: " + waitingForInput);

		if (!event.target.files) {
			return requestChangeImage(undefined);
		}

		return requestChangeImage(event.target.files[0]);
	}

	return (
		<SideContainer>
			<NameTime name={name} time={time} />
			<input
				type={"file"}
				ref={fileInput}
				style={{ display: "none" }}
				accept="image/jpeg, image/jpg"
				onChange={handleSelectedFileChange}
			/>
			{!!imageUrl ? (
				<LoadableImage
					onClick={popUpFileSelection}
					imageUrl={imageUrl}
				/>
			) : (
				<NoImageContainer onClick={popUpFileSelection}>
					<div
						style={{
							width: "100%",
							height: "100%",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
						}}
					>
						<div style={{ textAlign: "center", display: "flex", flexDirection:"column", justifyContent:"center", gap:constants.smallGap }}>
							<span
								style={{
									fontSize: constants.regularLargerSize,
									fontWeight: "bold",
									color: `rgb(${constants.watermark[0]},${constants.watermark[1]},${constants.watermark[2]})`,
									cursor: "default",
								}}
							>
								CLICK TO CHOOSE IMAGE
							</span>
							<span
								style={{
									fontSize: constants.regularFontSize,
									color: `rgb(${constants.watermark[0]},${constants.watermark[1]},${constants.watermark[2]})`,
									cursor: "default",
								}}
							>
								(MUST BE JPG/JPEG)
							</span>
						</div>
					</div>
				</NoImageContainer>
			)}
			<Stats points={points} dislikes={dislikes} likes={likes} />
		</SideContainer>
	);
}

const FakeCaptionTextArea = styled.div`
	flex-grow: 1;
	flex-basis: 0;
	border: 1px solid black;
	border-radius: ${constants.radius};
	background-color: rgb(
		${constants.backgroundLite[0]},
		${constants.backgroundLite[1]},
		${constants.backgroundLite[2]}
	);
`;

interface AddImagePanelProps {
    requestAddImage: React.MouseEventHandler
}

function AddImagePanel({ requestAddImage }: AddImagePanelProps) {
	return (
		<AddCaptionContainer>
			<TextAreaContainer>
				<FakeCaptionTextArea />
			</TextAreaContainer>
			<WhiteButton text="ADD IMAGE" onClick={requestAddImage} />
		</AddCaptionContainer>
	);
}

interface AddImagePreviewCaptionSideProps extends AddImagePanelProps {
    captions: RankedCaptionData[],
}
function AddImagePreviewCaptionSide({
	captions,
	requestAddImage,
}: AddImagePreviewCaptionSideProps) {
	return (
		<SideContainer>
			<CaptionGroups captions={captions} />
			<AddImagePanel requestAddImage={requestAddImage} />
		</SideContainer>
	);
}

interface AddImagePreviewProps
	extends Omit<ImagePreviewProps, "name"| "imageUrl">,
		AddImagePreviewCaptionSideProps {
    image: File | undefined
	userData: UserData;
}

function AddImagePreview({
	userData,
	requestChangeImage,
	image,
	time,
	points,
	dislikes,
	likes,
	captions,
	requestAddImage,
}: AddImagePreviewProps) {
	return (
		<TwoSidedCard
			left={
				<ImagePreview
					imageUrl={!!image? URL.createObjectURL(image): false}
					requestChangeImage={requestChangeImage}
					name={userData.username}
					time={time}
					points={points}
					dislikes={dislikes}
					likes={likes}
				/>
			}
			right={
				<AddImagePreviewCaptionSide
					captions={captions}
					requestAddImage={requestAddImage}
				/>
			}
		/>
	);
}


export { ImageCaptionsCard, AddImagePreview };
