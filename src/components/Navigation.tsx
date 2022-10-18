import React from "react";
import styled from "styled-components";
import constants from "./constants";
import { WhiteButton } from "./Utils";
import { Link } from "react-router-dom";
import { EventEmitter } from "../Utils";

interface ImagesNumberProps {
	shown: number;
	total: number;
}
function ImagesNumber({ shown, total }: ImagesNumberProps) {
	return (
		<div
			style={{
				display: "inline-block",
				fontSize: constants.regularFontSize,
			}}
		>
			SHOWING <span style={{ fontWeight: "bold" }}>{shown}</span> IMAGES
			OUT OF <span style={{ fontWeight: "bold" }}>{total}</span>
		</div>
	);
}

const NavigationButtonsContainer = styled.span`
	display: inline-flex;
	gap: ${constants.smallGap};
`;
function NavigationButtons() {
	return (
		<NavigationButtonsContainer>
			<Link to="/sign-in">
				<WhiteButton text="SIGN IN" />
			</Link>
			<Link to="/sign-up">
				<WhiteButton text="CREATE ACCOUNT" />
			</Link>
			<WhiteButton onClick={() => {}} text="ADD IMAGE" />
		</NavigationButtonsContainer>
	);
}

const NavigationOuterContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: ${constants.smallGap};
	padding-left: 0px;
	padding-right: 0px;
	align-items: center;
	box-sizing: border-box;
`;

const NavigationInnerContainer = styled.div`
	width: ${constants.mainContentWidth};
	display: flex;
	justify-content: space-between;
	align-items: baseline;
`;

function Navigation() {
	return (
		<NavigationOuterContainer>
			<NavigationInnerContainer>
				<ImagesNumber shown={3} total={10} />
				<NavigationButtons />
			</NavigationInnerContainer>
		</NavigationOuterContainer>
	);
}

export default Navigation;
