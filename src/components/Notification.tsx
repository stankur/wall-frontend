import React, { useState } from "react";
import { EventEmitter } from "../Utils";
import {desktopConstants} from "../constants/ComponentConstants";
import styled from "styled-components";
import { WhiteButton } from "./Utils";

const NotificationOuterContainer = styled.div`
	position: fixed;
	right: 0;
	left: 0;
	top: 0;
	display: flex;
	flex-direction: column;
	align-items: stretch;
    z-index: 3;
`;

interface NotificationContainerProps {
    containerColor: number[]
}

const NotificationInnerContainer = styled.div<NotificationContainerProps>`
	display: flex;
	align-items: center;
	background-color: rgb(
		${(props) => props.containerColor[0]},
		${(props) => props.containerColor[1]},
		${(props) => props.containerColor[2]}
	);
	padding: ${desktopConstants.smallGap};
	padding-left: ${desktopConstants.bigGap};
	padding-right: ${desktopConstants.bigGap};
	box-sizing: border-box;
	border-bottom: 1px solid black;
`;

const MessageContainer = styled.span`
	font-size: ${desktopConstants.regularFontSize};
	font-weight: 500;
	display: "inline-flex";
	justify-content: "flex-start";
	flex-grow: 1;
`;

interface NotificationObj {
	message: string;
	type: "error" | "success";
}

interface NotificationProps {
	notification: NotificationObj | false;
}
function Notification({ notification }: NotificationProps) {
	const [internalNotification, setInternalNotification] = useState<
		NotificationObj | false
	>(notification);
    

	EventEmitter.on("error", function (message) {
		return setInternalNotification({ type: "error", message });
	});

	EventEmitter.on("success", function (message) {
		return setInternalNotification({ type: "success", message });
	});

	return (
		<>
			{internalNotification && (
				<NotificationOuterContainer>
					<NotificationInnerContainer
						containerColor={
							internalNotification.type === "error"
								? desktopConstants.error
								: desktopConstants.success
						}
					>
						<MessageContainer>
							{internalNotification.message}
						</MessageContainer>
						<WhiteButton
							onClick={() => {
								setInternalNotification(false);
							}}
							text="CLOSE"
						/>
					</NotificationInnerContainer>
				</NotificationOuterContainer>
			)}
		</>
	);
}

export default Notification;