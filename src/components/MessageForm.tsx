import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import styled from "styled-components";
import { BackgroundColorButton, CircleButton, WhiteButton } from "./Utils";
import { desktopConstants, mobileConstants } from "../constants/ComponentConstants";
import { Device } from "../types/types";

const ContentContainer = styled.div`
	padding: ${desktopConstants.smallGap};
	box-sizing: border-box;
`;

const ColumnContentContainer = styled(ContentContainer)`
	display: flex;
	flex-direction: column;
	gap: ${desktopConstants.smallGap};
`;

const Title = styled.div`
	font-size: ${desktopConstants.regularFontSize};
	font-weight: bold;
`;

const ContentText = styled.div`
	font-size: ${desktopConstants.regularLargerSize};
`;

const ExpandMessageFormButtonContainer = styled.div`
	position: relative;
	width: ${desktopConstants.messageFormButtonSize};
	height: ${desktopConstants.messageFormButtonSize};
	background-color: white;
	border: 1px solid black;
	border-radius: 50%;

	box-shadow: 0px 0px 9px 0 rgba(0, 0, 0, 0.25);

    cursor: pointer;
`;

const CenteredImg = styled.img`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

interface ExpandMessageFormButtonProps {
	onExpandClick: () => void;
}

const ButtonPositioningContainer = styled.span`
    display: inline-block;
    position: fixed;
    right: ${desktopConstants.mediumGap};
    bottom: ${desktopConstants.mediumGap};
`
function ExpandMessageFormButton({
	onExpandClick,
}: ExpandMessageFormButtonProps) {
	return (
		<ButtonPositioningContainer>
			<ExpandMessageFormButtonContainer onClick={onExpandClick}>
				<CenteredImg src="./mail.png" width="30px" alt="message us!" />
			</ExpandMessageFormButtonContainer>
		</ButtonPositioningContainer>
	);
}

interface CancelBarProps {
    onCancelClick: () => void;
}

const CancelButton = styled(CircleButton).attrs(() => {
	return { baseColor: mobileConstants.red };
})``;

const CancelBarContainer = styled(ContentContainer)`
    display: flex;
    justify-content: flex-start;
    border-bottom: 1px solid black;
`

function CancelBar({ onCancelClick }: CancelBarProps) {
	return (
		<CancelBarContainer>
			<CancelButton colored={true} onClick={onCancelClick} />
		</CancelBarContainer>
	);
}

const MessageFormDescriptionContainer = styled(ColumnContentContainer)`
	border-bottom: 1px solid black;
`;

function MessageFormDescription() {
	return (
		<MessageFormDescriptionContainer>
			<Title>SHOOT WALL A MESSAGE!</Title>
			<ContentText>
				It is very hard to understate how important your words will be to Wall :D
			</ContentText>
		</MessageFormDescriptionContainer>
	);
}


type MessageSubject = "ERROR" | "SUGGESTION" | "FEATURE REQUEST" | "GENERAL";
let messageSubjects: MessageSubject[] = [
	"ERROR",
	"SUGGESTION",
	"FEATURE REQUEST",
	"GENERAL",
];

const MessageTextArea = styled.textarea`
	resize: none;
	outline: none;
	border: 1px solid black;
	border-radius: ${desktopConstants.radius};
	padding: ${desktopConstants.smallGap};
	font-family: roboto;
`;

interface MessageGroupProps {
	value: string;
	handleChangeMessage: (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => void;
}

function MessageGroup({ value, handleChangeMessage }: MessageGroupProps) {
	return (
		<ColumnContentContainer>
			<Title>MESSAGE</Title>
			<MessageTextArea
				value={value}
				onChange={handleChangeMessage}
			/>
		</ColumnContentContainer>
	);
}

interface FormButtonProps {
	chosen: boolean;
	label: string;
	requestChangeSubject: () => void;
    fontSize?: string
}

function FormButton({
	chosen,
	label,
	requestChangeSubject,
	fontSize,
}: FormButtonProps) {
	if (chosen) {
		return <BackgroundColorButton text={label} fontSize={fontSize} />;
	}

	return (
		<WhiteButton
			onClick={requestChangeSubject}
			text={label}
			fontSize={fontSize}
		/>
	);
}
interface SubjectFormProps {
	handleChangeSubject: (newSubject: MessageSubject) => () => void;
	subject: MessageSubject;
}

function SubjectForm({ handleChangeSubject, subject }: SubjectFormProps) {
	return (
		<ColumnContentContainer>
			<Title>SUBJECT</Title>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				{messageSubjects.map(function (internalSubject) {
					return (
						<FormButton
							label={internalSubject}
							chosen={internalSubject === subject}
							requestChangeSubject={handleChangeSubject(
								internalSubject
							)}
							key={internalSubject}
						/>
					);
				})}
			</div>
		</ColumnContentContainer>
	);
}

const MessageFormOuterContainer = styled.div`
	width: ${desktopConstants.messageFormWidth};
	display: flex;
	flex-direction: column;
	border: 1px solid black;
	border-radius: ${desktopConstants.radius};
	background-color: white;

	position: fixed;
    z-index: 3;
	right: ${desktopConstants.mediumGap};
	bottom: ${desktopConstants.mediumGap};

    box-shadow: 2px 2px 9px 0 rgba(0,0,0, 0.25);
`;

const ButtonBar = styled(ContentContainer)`
    display: flex;
    justify-content: flex-end;
`;

interface MessageFormProps {
	onSendSuccess: () => void;
	onSendFailure: (err: Error) => void;
	onCancelClick: () => void;
}

function useMessageForm({
	onSendSuccess,
	onSendFailure,
}: Omit<MessageFormProps, "onCancelClick">): [
	string,
	MessageSubject,
	(event: React.SyntheticEvent) => void,
	(event: React.ChangeEvent<HTMLTextAreaElement>) => void,
	(newSubject: MessageSubject) => () => void
] {
	const [message, setMessage] = useState("");
	const [subject, setSubject] = useState<MessageSubject>("ERROR");

	function getEmailJsMessageObject() {
		return {
			subject,
			message,
		};
	}

	function handleClickSend(event: React.SyntheticEvent) {
		event.preventDefault();
		emailjs
			.send(
				process.env.REACT_APP_EMAILJS_SERVICE as string,
				process.env.REACT_APP_EMAILJS_TEMPLATE as string,
				getEmailJsMessageObject(),
				process.env.REACT_APP_EMAILJS_PUBLIC_KEY
			)
			.then(onSendSuccess, onSendFailure);
	}

	function handleChangeMessage(
		event: React.ChangeEvent<HTMLTextAreaElement>
	) {
		setMessage(event.currentTarget.value);
	}

	function handleChangeSubject(newSubject: MessageSubject) {
		return function () {
			setSubject(newSubject);
		};
	}

	return [
		message,
		subject,
		handleClickSend,
		handleChangeMessage,
		handleChangeSubject,
	];
}

function MessageForm({
	onSendSuccess,
	onSendFailure,
	onCancelClick,
}: MessageFormProps) {
	const [
		message,
		subject,
		handleClickSend,
		handleChangeMessage,
		handleChangeSubject,
	] = useMessageForm({ onSendSuccess, onSendFailure });

	return (
		<MessageFormOuterContainer>
			<CancelBar onCancelClick={onCancelClick} />
			<MessageFormDescription />
			<SubjectForm
				subject={subject}
				handleChangeSubject={handleChangeSubject}
			/>
			<MessageGroup
				value={message}
				handleChangeMessage={handleChangeMessage}
			/>
			<ButtonBar>
				<BackgroundColorButton
					text="SUBMIT"
					onClick={handleClickSend}
				/>
			</ButtonBar>
		</MessageFormOuterContainer>
	);
}



interface ExpandableMessageFormProps
	extends ExpandMessageFormButtonProps,
		MessageFormProps {
	expanded: boolean;
}
function ExpandableMessageForm({
	expanded,
	onSendSuccess,
	onSendFailure,
	onCancelClick,
	onExpandClick,
}: ExpandableMessageFormProps) {
	if (expanded) {
		return (
			<MessageForm
				onSendSuccess={onSendSuccess}
				onSendFailure={onSendFailure}
				onCancelClick={onCancelClick}
			/>
		);
	}

	return <ExpandMessageFormButton onExpandClick={onExpandClick} />;
}

//////////////////////////////////////////////////////////// MOBILE COMPONENTS ////////////////////////////////////////////////////////////

const MobileButtonPositioningContainer = styled(ButtonPositioningContainer)`
    right: ${mobileConstants.smallGap};
    bottom: ${mobileConstants.smallGap};
`
const MobileExpandMessageFormButtonContainer = styled(
	ExpandMessageFormButtonContainer
)`
	width: ${mobileConstants.messageFormButtonSize};
	height: ${mobileConstants.messageFormButtonSize};
`; 

const MobileMessageFormOuterContainer = styled(MessageFormOuterContainer)`
	width: ${mobileConstants.messageFormWidth};

	right: ${mobileConstants.smallGap};
	bottom: ${mobileConstants.smallGap};
`;

function MobileExpandMessageFormButton({
	onExpandClick,
}: ExpandMessageFormButtonProps) {
	return (
		<MobileButtonPositioningContainer>
			<MobileExpandMessageFormButtonContainer onClick={onExpandClick}>
				<CenteredImg src="./mail.png" width="28px" alt="message us!" />
			</MobileExpandMessageFormButtonContainer>
		</MobileButtonPositioningContainer>
	);
}

function MobileSubjectForm({ handleChangeSubject, subject }: SubjectFormProps) {
	return (
		<ColumnContentContainer>
			<Title>SUBJECT</Title>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				{messageSubjects.map(function (internalSubject) {
					return (
						<FormButton
							label={internalSubject}
							chosen={internalSubject === subject}
							requestChangeSubject={handleChangeSubject(
								internalSubject
							)}
							fontSize={mobileConstants.smallFontSize}
							key={internalSubject}
						/>
					);
				})}
			</div>
		</ColumnContentContainer>
	);
};

function MobileMessageForm({
	onSendSuccess,
	onSendFailure,
	onCancelClick,
}: MessageFormProps) {
	const [
		message,
		subject,
		handleClickSend,
		handleChangeMessage,
		handleChangeSubject,
	] = useMessageForm({ onSendSuccess, onSendFailure });

	return (
		<MobileMessageFormOuterContainer>
			<CancelBar onCancelClick={onCancelClick} />
			<MessageFormDescription />
			<MobileSubjectForm
				subject={subject}
				handleChangeSubject={handleChangeSubject}
			/>
			<MessageGroup
				value={message}
				handleChangeMessage={handleChangeMessage}
			/>
			<ButtonBar>
				<BackgroundColorButton
					text="SUBMIT"
					onClick={handleClickSend}
					fontSize={mobileConstants.regularSmallerFontSize}
				/>
			</ButtonBar>
		</MobileMessageFormOuterContainer>
	);
}

function MobileExpandableMessageForm({
	expanded,
	onSendSuccess,
	onSendFailure,
	onCancelClick,
	onExpandClick,
}: ExpandableMessageFormProps) {
    if (expanded) {
        return (
			<MobileMessageForm
				onSendSuccess={onSendSuccess}
				onSendFailure={onSendFailure}
				onCancelClick={onCancelClick}
			/>
		);
    }

    return <MobileExpandMessageFormButton onExpandClick={onExpandClick}/>
};

//////////////////////////////////////////////////////////// RESPONSIVE COMPONENTS ////////////////////////////////////////////////////////////

interface ResponsiveExpandableMessageFormProps
	extends ExpandableMessageFormProps {
	device: Device;
}

function ResponsiveExpandableMessageForm({
	device,
	expanded,
	onSendSuccess,
	onSendFailure,
	onCancelClick,
	onExpandClick,
}: ResponsiveExpandableMessageFormProps) {
	if (device === "mobile") {
		return (
			<MobileExpandableMessageForm
				expanded={expanded}
				onSendSuccess={onSendSuccess}
				onSendFailure={onSendFailure}
				onCancelClick={onCancelClick}
				onExpandClick={onExpandClick}
			/>
		);
	}

    return (
		<ExpandableMessageForm
			expanded={expanded}
			onSendSuccess={onSendSuccess}
			onSendFailure={onSendFailure}
			onCancelClick={onCancelClick}
			onExpandClick={onExpandClick}
		/>
	);
}

export default ResponsiveExpandableMessageForm;