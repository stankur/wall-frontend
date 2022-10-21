import React from "react";
import styled from "styled-components";
import constants from "./constants";
import { WhiteButton } from "./Utils";
import { Link } from "react-router-dom";
import { UserDataState } from "../hooks/authenticationHooks";

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
    align-items: center;
	gap: ${constants.smallGap};
`;

interface NavigationButtonsProps {
    userData: UserDataState
}
function NavigationButtons({ userData }: NavigationButtonsProps) {
	return (
		<NavigationButtonsContainer>
			{!userData ? (
				userData === undefined ? (
					<></>
				) : (
					<>
						<Link to="/sign-in">
							<WhiteButton text="SIGN IN" />
						</Link>
						<Link to="/sign-up">
							<WhiteButton text="CREATE ACCOUNT" />
						</Link>
					</>
				)
			) : (
				<>
					<span style={{ fontWeight: "bold" }}>
						{userData.username}
					</span>
					<WhiteButton text="SIGN OUT" />
				</>
			)}
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

interface NavigationProps {
    userData:UserDataState
}

function Navigation({userData}: NavigationProps) {
	return (
		<NavigationOuterContainer>
			<NavigationInnerContainer>
				<ImagesNumber shown={3} total={10} />
				<NavigationButtons userData={userData} />
			</NavigationInnerContainer>
		</NavigationOuterContainer>
	);
}

export default Navigation;
