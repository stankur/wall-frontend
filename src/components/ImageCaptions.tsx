import React, { useState, ReactEventHandler, useRef, ReactElement } from "react";
import styled, { keyframes } from "styled-components";
import {
	desktopConstants,
	mobileConstants,
} from "../constants/ComponentConstants";
import { WhiteButton, TwoSidedCard, LoaderDiv, MobileLoaderDiv, MobileTwoSidedCard, MobileBackgroundColorButton, MobileWhiteButton } from "./Utils";
import {
	ImageData,
	ImageDataWithInteractions,
	Interaction,
	RankedCaptionData,
	RankedCaptionDataWithInteractions,
	UserData,
} from "../types/types";
import { convertTimeToElapsedTime, immutableSortRank } from "./helper";
import { v4 as uuid } from "uuid";
import { EventEmitter } from "../Utils";
import {
	RequestInteractFunction,
	RequestInteractFunctionGivenPostData,
} from "../hooks/interactionHooks";
import dayjs from "dayjs";

const PostInfoBarOuterContainer = styled.div`
	padding: ${desktopConstants.smallGap};
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
					fontSize: desktopConstants.regularFontSize,
				}}
			>
				{name.toUpperCase()}
			</span>
			<span
				style={{
					fontWeight: 500,
					fontSize: desktopConstants.regularFontSize,
				}}
			>
				{convertTimeToElapsedTime(time)}
			</span>
		</PostInfoBarOuterContainer>
	);
}
interface PlusButtonContainerProps {
	chosen: boolean;
}

const PlusButtonContainer = styled.div<PlusButtonContainerProps>`
	width: 14px;
	height: 14px;
	border-radius: 50%;
	border: 1px solid black;
	font-size: ${desktopConstants.regularFontSize};
	position: relative;
	background-color: ${(props) =>
		props.chosen
			? `rgb(${desktopConstants.background[0]}, ${desktopConstants.background[1]}, ${desktopConstants.background[2]})`
			: "white"};
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

interface PlusButtonProps {
	onClick: () => void;
	chosen: boolean;
}

function PlusButton({ onClick, chosen }: PlusButtonProps) {
	return (
		<PlusButtonContainer chosen={chosen} onClick={onClick}>
			{!chosen && <PlusSignContainer>+</PlusSignContainer>}
		</PlusButtonContainer>
	);
}

const SmallerGappedContainer = styled.div`
	display: inline-flex;
	align-items: center;
	gap: ${desktopConstants.smallerGap};
`;

interface StatsPairProps {
	keyName: string;
	value: string;
}

function StatsPair({ keyName, value }: StatsPairProps) {
	return (
		<SmallerGappedContainer style={{ alignItems: "baseline" }}>
			<span
				style={{
					fontSize: desktopConstants.regularFontSize,
					fontWeight: 500,
				}}
			>
				{keyName}
			</span>
			<span style={{ fontWeight: "bold" }}>{value}</span>
		</SmallerGappedContainer>
	);
}

interface StatsPairAndPlusButtonProps extends StatsPairProps {
	onPlusButtonClick?: () => void;
	chosen: boolean;
}

function StatsPairAndPlusButton({
	keyName,
	value,
	chosen,
	onPlusButtonClick = () => {},
}: StatsPairAndPlusButtonProps) {
	return (
		<SmallerGappedContainer>
			<span style={{ position: "relative", top: "1px" }}>
				<PlusButton onClick={onPlusButtonClick} chosen={chosen} />
			</span>
			<StatsPair keyName={keyName} value={value} />
		</SmallerGappedContainer>
	);
}
function useChangeInteraction(
	requestChangeInteraction: RequestInteractFunctionGivenPostData,
	interaction: Interaction
): [() => void, () => void] {
	function onLikeClick() {
		if (interaction === "like") {
			return requestChangeInteraction(interaction, null);
		}
		requestChangeInteraction(interaction, "like");
	}

	function onDislikeClick() {
		if (interaction === "dislike") {
			return requestChangeInteraction(interaction, null);
		}
		requestChangeInteraction(interaction, "dislike");
	}

	return [onLikeClick, onDislikeClick];
};

interface StatsProps {
	points: number;
	likes: number;
	dislikes: number;
	requestChangeInteraction: RequestInteractFunctionGivenPostData;
	interaction: Interaction;
}
function Stats({
	points,
	likes,
	dislikes,
	requestChangeInteraction,
	interaction,
}: StatsProps) {
	const [onLikeClick, onDislikeClick] = useChangeInteraction(
		requestChangeInteraction,
		interaction
	);
	return (
		<PostInfoBarOuterContainer>
			<StatsPair keyName="POINTS" value={points.toString()} />
			<StatsPairAndPlusButton
				keyName="LIKES"
				value={likes.toString()}
				onPlusButtonClick={onLikeClick}
				chosen={interaction === "like"}
			/>
			<StatsPairAndPlusButton
				keyName="DISLIKES"
				value={dislikes.toString()}
				onPlusButtonClick={onDislikeClick}
				chosen={interaction === "dislike"}
			/>
		</PostInfoBarOuterContainer>
	);
}



function useImageLoaded() {
	const [loaded, setLoaded] = useState(false);

	function onLoad() {
		setLoaded(true);
	}

	return [loaded, onLoad];
}

const NoImageContainer = styled.div`
	height: ${desktopConstants.NoImageContainerHeight};
	border-top: 1px solid black;
	border-bottom: 1px solid black;
`;

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

interface LoadableImageProps {
	imageUrl: string;
	onClick?: React.MouseEventHandler;
    loadingImage?: ReactElement;
}

function LoadableImage({
	imageUrl,
	onClick = () => {
		return;
	},
	loadingImage = <LoadingImage />,
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
			{!loaded && loadingImage}
		</>
	);
}

interface ImageSideProps
	extends StatsProps,
		NameTimeProps,
		Pick<LoadableImageProps, "imageUrl"> {
	requestChangeInteraction: RequestInteractFunctionGivenPostData;
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
	interaction,
	requestChangeInteraction,
}: ImageSideProps) {
	return (
		<SideContainer>
			<NameTime name={name} time={time} />
			<LoadableImage imageUrl={imageUrl} />
			<Stats
				requestChangeInteraction={requestChangeInteraction}
				points={points}
				dislikes={dislikes}
				likes={likes}
				interaction={interaction}
			/>
		</SideContainer>
	);
}

const CaptionContainer = styled.div`
	padding: ${desktopConstants.smallGap};
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
	interaction: Interaction;
	requestChangeInteraction: RequestInteractFunctionGivenPostData;
}

function CaptionGroup({
	text,
	name,
	time,
	points,
	likes,
	dislikes,
	interaction,
	requestChangeInteraction,
}: CaptionGroupProps) {
	return (
		<CaptionGroupContainer>
			<NameTime name={name} time={time} />
			<Caption text={text} />
			<Stats
				requestChangeInteraction={requestChangeInteraction}
				points={points}
				likes={likes}
				dislikes={dislikes}
				interaction={interaction}
			/>
		</CaptionGroupContainer>
	);
}

const AddCaptionContainer = styled.div`
	display: flex;
	align-items: stretch;
	padding: ${desktopConstants.smallerGap};
	gap: ${desktopConstants.smallerGap};
	background-color: rgb(
		${desktopConstants.background[0]},
		${desktopConstants.background[1]},
		${desktopConstants.background[2]}
	);
	border-top: 1px solid black;
	border-bottom-right-radius: ${desktopConstants.radius};
	margin-top: -1px;
`;

const TextAreaContainer = styled.div`
	display: inline-flex;
	flex-direction: column;
	flex-grow: 1;
`;

const CaptionTextArea = styled.textarea`
	flex-grow: 1;
	flex-basis: 0;
	resize: none;
	outline: none;
	border: 1px solid black;
	border-radius: ${desktopConstants.radius};
	font-family: roboto;
`;

interface AddCaptionPanelProps {
	onClick: React.MouseEventHandler;
	value: string;
	onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

function AddCaptionPanel({ onClick, value, onChange }: AddCaptionPanelProps) {
	return (
		<AddCaptionContainer>
			<TextAreaContainer>
				<CaptionTextArea value={value} onChange={onChange} />
			</TextAreaContainer>
			<WhiteButton text="ADD CAPTION" onClick={onClick} />
		</AddCaptionContainer>
	);
}

const CaptionGroupsContainer = styled.div`
	flex-basis: 0;
	flex-grow: 1;
	overflow: scroll;
`;

function createRequestChangeCaptionInteraction(
	requestInteract: RequestInteractFunction,
	id: string
) {
	return function (
		prevInteractionType: Interaction,
		newInteractionType: Interaction
	) {
		return requestInteract("caption", id)(
			prevInteractionType,
			newInteractionType
		);
	};
};

interface CaptionGroupsProps {
	captions: RankedCaptionData[] | RankedCaptionDataWithInteractions[];
	requestInteract?: RequestInteractFunction;
}
function CaptionGroups({
	captions,
	requestInteract = () => () => {},
}: CaptionGroupsProps) {
	return (
		<CaptionGroupsContainer>
			{immutableSortRank<
				RankedCaptionData | RankedCaptionDataWithInteractions
			>(captions).map(function (caption) {
				const requestChangeInteraction =
					createRequestChangeCaptionInteraction(
						requestInteract,
						caption.id
					);

				return (
					<CaptionGroup
						requestChangeInteraction={requestChangeInteraction}
						name={caption.username.toUpperCase()}
						time={caption.created_at}
						text={caption.text}
						points={caption.points}
						likes={caption.likes}
						dislikes={caption.dislikes}
						key={uuid()}
						interaction={
							"interaction" in caption
								? caption.interaction
								: null
						}
					/>
				);
			})}
		</CaptionGroupsContainer>
	);
}

interface CaptionsSideProps extends CaptionGroupsProps, AddCaptionPanelProps {}

function CaptionsSide({
	captions,
	onClick,
	value,
	onChange,
	requestInteract,
}: CaptionsSideProps) {
	return (
		<SideContainer>
			<CaptionGroups
				captions={captions}
				requestInteract={requestInteract}
			/>
			<AddCaptionPanel
				onClick={onClick}
				value={value}
				onChange={onChange}
			/>
		</SideContainer>
	);
}

interface ImageCaptionsCardProps
	extends Omit<CaptionsSideProps, "captions" | "requestInteract"> {
	data: ImageData | ImageDataWithInteractions;
	requestChangeImageInteraction: RequestInteractFunctionGivenPostData;
	requestInteractCaption: RequestInteractFunction;
}

function ImageCaptionsCard({
	data,
	onClick,
	value,
	onChange,
	requestInteractCaption,
	requestChangeImageInteraction,
}: ImageCaptionsCardProps) {
	return (
		<TwoSidedCard
			left={
				<ImageSide
					requestChangeInteraction={requestChangeImageInteraction}
					name={data.username}
					time={data.created_at}
					points={data.points}
					likes={data.likes}
					dislikes={data.dislikes}
					imageUrl={data.imageUrl}
					interaction={
						"interaction" in data ? data["interaction"] : null
					}
				/>
			}
			right={
				<CaptionsSide
					requestInteract={requestInteractCaption}
					captions={data.captions}
					onClick={onClick}
					value={value}
					onChange={onChange}
				/>
			}
		/>
	);
}
// here and below up to the next comment breakpoint are the components specifically for add-image route
interface ImagePreviewProps
	extends Omit<
		ImageSideProps,
		"imageUrl" | "interaction" | "requestChangeInteraction"
	> {
	imageUrl: string | false;
	requestChangeImage: (newImage: File | undefined) => void;
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
				setTimeout(() => setWaitingForInput(false), 500);
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
						<div
							style={{
								textAlign: "center",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								gap: desktopConstants.smallGap,
							}}
						>
							<span
								style={{
									fontSize:
										desktopConstants.regularLargerSize,
									fontWeight: "bold",
									color: `rgb(${desktopConstants.watermark[0]},${desktopConstants.watermark[1]},${desktopConstants.watermark[2]})`,
									cursor: "default",
								}}
							>
								CLICK TO CHOOSE IMAGE
							</span>
							<span
								style={{
									fontSize: desktopConstants.regularFontSize,
									color: `rgb(${desktopConstants.watermark[0]},${desktopConstants.watermark[1]},${desktopConstants.watermark[2]})`,
									cursor: "default",
								}}
							>
								(MUST BE JPG/JPEG)
							</span>
						</div>
					</div>
				</NoImageContainer>
			)}
			<Stats
				requestChangeInteraction={() => {}}
				points={points}
				dislikes={dislikes}
				likes={likes}
				interaction={null}
			/>
		</SideContainer>
	);
}

const FakeCaptionTextArea = styled.div`
	flex-grow: 1;
	flex-basis: 0;
	border: 1px solid black;
	border-radius: ${desktopConstants.radius};
	background-color: rgb(
		${desktopConstants.backgroundLite[0]},
		${desktopConstants.backgroundLite[1]},
		${desktopConstants.backgroundLite[2]}
	);
`;

interface AddImagePanelProps {
	requestAddImage: React.MouseEventHandler;
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
	captions: RankedCaptionData[];
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
	extends Omit<ImagePreviewProps, "name" | "imageUrl">,
		AddImagePreviewCaptionSideProps {
	image: File | undefined;
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
					imageUrl={!!image ? URL.createObjectURL(image) : false}
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

// here and below up to the next comment breakpoint are the components specifically for LoadingImageCaption

const LoaderOpacityAnimation = keyframes`
    from {
        background-color: rgb(
		${desktopConstants.backgroundDarker[0]},
		${desktopConstants.backgroundDarker[1]},
		${desktopConstants.backgroundDarker[2]}	
        )
    }

    to {
        background-color: rgb(
		${desktopConstants.background[0]},
		${desktopConstants.background[1]},
		${desktopConstants.background[2]},
        )    
    }

`;
interface loadingBarProps {
	width?: string;
	display?: "inline-block";
}
const LoadingBar = styled.span<loadingBarProps>`
	border: 1px solid black;
	background-color: rgb(
		${desktopConstants.background[0]},
		${desktopConstants.background[1]},
		${desktopConstants.background[2]}
	);
	animation: ${LoaderOpacityAnimation} 0.5s ease-in-out infinite alternate;
	height: ${desktopConstants.loadingBarHeight};
	width: ${(props) => (props.width ? props.width : "100%")};
	display: ${(props) => (props.display ? props.display : "inline")};
`;

function LoadingNameTime() {
	return (
		<PostInfoBarOuterContainer>
			<LoadingBar width="20%" />
			<LoadingBar width="30%" />
		</PostInfoBarOuterContainer>
	);
}

function LoadingStats() {
	return (
		<PostInfoBarOuterContainer>
			<LoadingBar />
		</PostInfoBarOuterContainer>
	);
}

function LoadingCaption() {
	return (
		<CaptionContainer>
			<LoadingBar width="60%" display="inline-block" />
		</CaptionContainer>
	);
}

function LoadingCaptionGroup() {
	return (
		<CaptionGroupContainer>
			<LoadingNameTime />
			<LoadingCaption />
			<LoadingStats />
		</CaptionGroupContainer>
	);
}

const LoadingAddCaptionButton = styled.div`
	width: 30%;
	height: ${desktopConstants.loadingButtonHeight};
	border: 1px solid black;
	border-radius: ${desktopConstants.radius};
	background-color: rgb(
		${desktopConstants.backgroundLite[0]},
		${desktopConstants.backgroundLite[1]},
		${desktopConstants.backgroundLite[2]}
	);
`;

function LoadingAddCapionPanel() {
	return (
		<AddCaptionContainer>
			<TextAreaContainer>
				<FakeCaptionTextArea />
			</TextAreaContainer>
			<LoadingAddCaptionButton />
		</AddCaptionContainer>
	);
}

interface LoadingCaptionGroupsProps {
	captions: number;
}

function LoadingCaptionGroups({ captions }: LoadingCaptionGroupsProps) {
	let decoyArr = [];
	for (let i = 0; i < captions; i++) {
		decoyArr.push(1);
	}
	return (
		<CaptionGroupsContainer>
			{decoyArr.map(() => (
				<LoadingCaptionGroup key={uuid()} />
			))}
		</CaptionGroupsContainer>
	);
}

function LoadingCaptionSide() {
	return (
		<SideContainer>
			<LoadingCaptionGroups captions={3} />
			<LoadingAddCapionPanel />
		</SideContainer>
	);
}

function LoadingImageSide() {
	return (
		<SideContainer>
			<LoadingNameTime />
			<LoadingImage />
			<LoadingStats />
		</SideContainer>
	);
}

function LoadingImageCaptionsCard() {
	return (
		<TwoSidedCard
			left={<LoadingImageSide />}
			right={<LoadingCaptionSide />}
		/>
	);
}

//////////////////////////////////////////////////////////// MOBILE COMPONENTS ////////////////////////////////////////////////////////////

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


const UpvoteButton = styled(CircleButton).attrs(() => {
	return { baseColor: mobileConstants.upvoteColor };
})``;

const DownvoteButton = styled(CircleButton).attrs(() => {
	return { baseColor: mobileConstants.downvoteColor };
})``;

const MobilePostInfoOuterContainer = styled(PostInfoBarOuterContainer)`
	padding: ${mobileConstants.smallGap};
`;


interface MobileNameTimeProps {
	name: string;
	time?: string | undefined;
}

function MobileNameTime({ name, time = undefined }: MobileNameTimeProps) {
	return (
		<MobilePostInfoOuterContainer>
			<span
				style={{
					fontWeight: "bold",
					fontSize: mobileConstants.regularFontSize,
				}}
			>
				{name.toUpperCase()}
			</span>
			{!!time ? (
				<span
					style={{
						fontWeight: 500,
						fontSize: mobileConstants.regularFontSize,
					}}
				>
					{convertTimeToElapsedTime(time)}
				</span>
			) : (
				<span style={{ flexGrow: 1 }} />
			)}
		</MobilePostInfoOuterContainer>
	);
}

const StatsPairContainer = styled.div`
	display: inline-flex;
	gap: ${mobileConstants.smallGap};
	align-items: baseline;
`;

function MobileStatsPair({ keyName, value }: StatsPairProps) {
	return (
		<StatsPairContainer>
			<span
				style={{
					fontSize: mobileConstants.regularFontSize,
					fontWeight: 500,
				}}
			>
				{keyName}
			</span>
			<span
				style={{
					fontSize: mobileConstants.regularFontSize,
					fontWeight: "bold",
				}}
			>
				{value}
			</span>
		</StatsPairContainer>
	);
}

const MobileButtonsContainer = styled.div`
    display: inline-flex;
    gap: ${mobileConstants.smallGap};
`


interface MobileStatsProps {
	points: number;
	requestChangeInteraction: RequestInteractFunctionGivenPostData;
	interaction: Interaction;
}

function MobileStats({
	points,
	requestChangeInteraction,
	interaction,
}: MobileStatsProps) {
    	const [onLikeClick, onDislikeClick] = useChangeInteraction(
			requestChangeInteraction,
			interaction
		);

	return (
		<MobilePostInfoOuterContainer style={{ alignItems: "center" }}>
			<MobileButtonsContainer>
				<UpvoteButton
					colored={interaction !== "dislike"}
					onClick={onLikeClick}
				/>
				<DownvoteButton
					colored={interaction !== "like"}
					onClick={onDislikeClick}
				/>
			</MobileButtonsContainer>
			<MobileStatsPair keyName="POINTS" value={points.toString()} />
		</MobilePostInfoOuterContainer>
	);
};

const MobileNoImageContainer = styled(NoImageContainer)`
    height: ${mobileConstants.mainContentWidth};
`

function MobileLoadingImage({
	onClick = () => {
		return;
	},
}: LoadingImageProps) {
	return (
		<MobileNoImageContainer onClick={onClick}>
			<MobileLoaderDiv />
		</MobileNoImageContainer>
	);
};

interface MobileImageSideProps
	extends MobileStatsProps,
		NameTimeProps,
		Pick<LoadableImageProps, "imageUrl"> {}
function MobileImageSide({
	name,
	time,
	points,
	imageUrl,
	requestChangeInteraction,
	interaction,
}: MobileImageSideProps) {
	return (
		<SideContainer>
			<MobileNameTime name={name} time={time} />
			<LoadableImage
				imageUrl={imageUrl}
				loadingImage={<MobileLoadingImage />}
			/>
			<MobileStats
				points={points}
				requestChangeInteraction={requestChangeInteraction}
				interaction={interaction}
			/>
		</SideContainer>
	);
}

const MobileCaptionContainer = styled(CaptionContainer)`
	padding: ${mobileConstants.smallGap};
	padding-top: 2px;
`;

function MobileCaption({ text }: CaptionProps) {
	return <MobileCaptionContainer>{text}</MobileCaptionContainer>;
} 


interface MobileCaptionGroupProps extends MobileNameTimeProps, CaptionProps, MobileStatsProps{
}

function MobileCaptionGroupContent({
	name,
	time,
	text,
	points,
	requestChangeInteraction,
	interaction,
}: MobileCaptionGroupProps) {
	return (
		<>
			<MobileNameTime name={name} time={time} />
			<MobileCaption text={text} />
			<MobileStats
				requestChangeInteraction={requestChangeInteraction}
				points={points}
				interaction={interaction}
			/>
		</>
	);
};

function MobileCaptionGroup({
	name,
	text,
	points,
	requestChangeInteraction,
	interaction,
}: MobileCaptionGroupProps) {
	return (
		<CaptionGroupContainer>
			<MobileCaptionGroupContent
				name={name}
				text={text}
				requestChangeInteraction={requestChangeInteraction}
				points={points}
				interaction={interaction}
			/>
		</CaptionGroupContainer>
	);
}


const MobileOptionsContainer = styled.div`
	padding: ${mobileConstants.smallGap};
    display: flex;
    justify-content: space-between;
`;

interface MobileOptionsProps {
	onViewMoreClick: () => void;
	onAddCaptionClick: () => void;
}

function MobileOptions({
	onViewMoreClick,
	onAddCaptionClick,
}: MobileOptionsProps) {
	return (
		<MobileOptionsContainer>
			<MobileBackgroundColorButton
				text={"VIEW MORE"}
				onClick={onViewMoreClick}
			/>
			<MobileBackgroundColorButton
				text={"ADD CAPTION"}
				onClick={onAddCaptionClick}
			/>
		</MobileOptionsContainer>
	);
}

const MobileCaptionGroupsContainer = styled.div`
    display: flex;
    flex-direction: column;
`

// captions must be an ARRAY of the top caption (1 element) or just empty (0 element)
function MobileCaptionGroups({
	captions,
	requestInteract = () => () => {},
}: CaptionGroupsProps) {
	return (
		<MobileCaptionGroupsContainer>
			{captions.map(function (caption) {
				const requestChangeInteraction =
					createRequestChangeCaptionInteraction(
						requestInteract,
						caption.id
					);

				return (
					<MobileCaptionGroup
						requestChangeInteraction={requestChangeInteraction}
						name={caption.username.toUpperCase()}
						time={caption.created_at}
						text={caption.text}
						points={caption.points}
						key={uuid()}
						interaction={
							"interaction" in caption
								? caption.interaction
								: null
						}
					/>
				);
			})}
		</MobileCaptionGroupsContainer>
	);
};

interface MobileCaptionsSideProps
	extends MobileOptionsProps,
		CaptionGroupsProps {}
function MobileCaptionsSide({
	captions,
	requestInteract,
	onViewMoreClick,
	onAddCaptionClick,
}: MobileCaptionsSideProps) {
	return (
		<SideContainer>
			<MobileCaptionGroups
				captions={captions}
				requestInteract={requestInteract}
			/>
			<MobileOptions
				onViewMoreClick={onViewMoreClick}
				onAddCaptionClick={onAddCaptionClick}
			/>
		</SideContainer>
	);
}


function MobileImageCaptionsCard() {
	return (
		<MobileTwoSidedCard
			top={
				<MobileImageSide
					name="STANKURN"
					time={dayjs().subtract(1, "day").format()}
					points={30}
					imageUrl="https://drive.google.com/uc?export=view&id=1WyP8f_tBhlYKUp-iFMOrV9dJIy1AVbEG"
					requestChangeInteraction={() => {}}
					interaction={null}
				/>
			}
			bottom={
				<MobileCaptionsSide
					captions={[]}
					onViewMoreClick={() => {}}
					onAddCaptionClick={() => {}}
				/>
			}
		/>
	);
}


// here and below up to the next comment breakpoint are the components specifically for Mobile Image Captions Card in Extended View

const MobileAddCaptionContainer = styled(AddCaptionContainer)`
	padding: ${mobileConstants.smallerGap};
	gap: ${mobileConstants.smallGap};
	background-color: rgb(
		${mobileConstants.background[0]},
		${mobileConstants.background[1]},
		${mobileConstants.background[2]}
	);
	border-radius: 0;
	border-bottom: 1px solid black;
`;

const MobileCaptionTextArea = styled(CaptionTextArea)`
	border-radius: ${mobileConstants.innerRadius};
`;

function MobileAddCaptionPanel({
	onClick,
	value,
	onChange,
}: AddCaptionPanelProps) {
	return (
		<MobileAddCaptionContainer>
			<TextAreaContainer>
				<MobileCaptionTextArea value={value} onChange={onChange} />
			</TextAreaContainer>
			<MobileWhiteButton text="ADD CAPTION" onClick={onClick} />
		</MobileAddCaptionContainer>
	);
};

interface MobileCaptionGroupExpandedProps extends MobileCaptionGroupProps {
    time: string;
}

function MobileCaptionGroupExpanded({
	text,
	name,
	time,
	points,
	interaction,
	requestChangeInteraction,
}: MobileCaptionGroupExpandedProps) {
    return (
		<CaptionGroupContainer>
			<MobileCaptionGroupContent
				name={name}
                time={time}
				text={text}
				requestChangeInteraction={requestChangeInteraction}
				points={points}
				interaction={interaction}
			/>
		</CaptionGroupContainer>
	);
};


const UnborderedCaptionGroupContainer = styled(CaptionGroupContainer)`
	border-width: 0px;
`;
function MobileUnborderedCaptionGroup({
	text,
	name,
	time,
	points,
	interaction,
	requestChangeInteraction,
}: MobileCaptionGroupExpandedProps) {
	return (
		<UnborderedCaptionGroupContainer>
			<MobileCaptionGroupContent
				name={name}
				time={time}
				text={text}
				requestChangeInteraction={requestChangeInteraction}
				points={points}
				interaction={interaction}
			/>
		</UnborderedCaptionGroupContainer>
	);
}

function MobileCaptionGroupsExpanded({
	captions,
	requestInteract = () => () => {},
}: CaptionGroupsProps) {
	let lastCaptionIndex = captions.length - 1;
	return (
		<MobileCaptionGroupsContainer>
			{immutableSortRank<
				RankedCaptionData | RankedCaptionDataWithInteractions
			>(captions).map(function (caption, index) {
				const requestChangeInteraction =
					createRequestChangeCaptionInteraction(
						requestInteract,
						caption.id
					);

				if (index === lastCaptionIndex) {
					return (
						<MobileUnborderedCaptionGroup
							requestChangeInteraction={requestChangeInteraction}
							name={caption.username.toUpperCase()}
							time={caption.created_at}
							text={caption.text}
							points={caption.points}
							key={uuid()}
							interaction={
								"interaction" in caption
									? caption.interaction
									: null
							}
						/>
					);
				}

				return (
					<MobileCaptionGroupExpanded
						requestChangeInteraction={requestChangeInteraction}
						name={caption.username.toUpperCase()}
						time={caption.created_at}
						text={caption.text}
						points={caption.points}
						key={uuid()}
						interaction={
							"interaction" in caption
								? caption.interaction
								: null
						}
					/>
				);
			})}
		</MobileCaptionGroupsContainer>
	);
};

function MobileCaptionsSideExpanded({
	captions,
	onClick,
	value,
	onChange,
	requestInteract,
}: CaptionsSideProps) {
    return (
		<SideContainer>
			<MobileAddCaptionPanel
				onClick={onClick}
				value={value}
				onChange={onChange}
			/>
			<MobileCaptionGroupsExpanded
				captions={captions}
				requestInteract={requestInteract}
			/>
		</SideContainer>
	);
};

function MobileImageCaptionsCardExtended( ) {
    return (
		<MobileTwoSidedCard
			top={
				<MobileImageSide
					name="STANKURN"
					time={dayjs().subtract(1, "day").format()}
					points={30}
					imageUrl="https://drive.google.com/uc?export=view&id=1WyP8f_tBhlYKUp-iFMOrV9dJIy1AVbEG"
					requestChangeInteraction={() => {}}
					interaction={null}
				/>
			}
			bottom={
				<MobileCaptionsSideExpanded
					captions={[
						{
							id: "f7bed58d-f594-4acc-8766-6fbc048335a0",
							text: "caption14",
							user: "f3d36de3-8c36-45b8-b90a-28c0c19c37a5",
							username: "user4",
							image: "d72f345e-27d5-4143-b76b-ba080bf62ba7",
							created_at: "2022-10-10T21:07:42.658Z",
							updated_at: "2022-10-10T21:07:42.658Z",
							likes: 3,
							dislikes: 0,
							points: 3,
							rank: 1,
						},
						{
							id: "926b0e63-cd4e-4523-a2e2-b8155037ad41",
							text: "caption11",
							user: "3f131c59-cdbf-4ada-a549-8605e274b210",
							username: "user3",
							image: "d72f345e-27d5-4143-b76b-ba080bf62ba7",
							created_at: "2022-10-10T21:05:16.545Z",
							updated_at: "2022-10-10T21:05:16.545Z",
							likes: 3,
							dislikes: 0,
							points: 3,
							rank: 2,
						},
						{
							id: "d1e463e6-94b6-428b-9c03-e29408cca093",
							text: "caption12",
							user: "6ef2cc57-4dbc-448c-bda9-02c8192d4aa5",
							username: "user2",
							image: "d72f345e-27d5-4143-b76b-ba080bf62ba7",
							created_at: "2022-10-10T21:06:01.126Z",
							updated_at: "2022-10-10T21:06:01.126Z",
							likes: 2,
							dislikes: 0,
							points: 2,
							rank: 3,
						},
					]}
					requestInteract={()=>()=>{}}
					onClick={()=>{}}
					value={""}
					onChange={() =>{}}
				/>
			}
		/>
	);

}




export { ImageCaptionsCard, AddImagePreview, LoadingImageCaptionsCard };
export type { ImageCaptionsCardProps };
export { MobileImageCaptionsCard, MobileImageCaptionsCardExtended };
