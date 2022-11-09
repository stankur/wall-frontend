import React, { ReactElement } from "react";
import styled from "styled-components";
import {desktopConstants, mobileConstants} from "../constants/ComponentConstants";
import { MobileWhiteButton, WhiteButton } from "./Utils";
import { Link, useNavigate } from "react-router-dom";
import { UserDataState, useSignOut } from "../hooks/authenticationHooks";
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
				fontSize: desktopConstants.regularFontSize,
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
	gap: ${desktopConstants.smallGap};
`;

interface NavigationButtonsProps {
	userData: UserDataState;
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>;
	requestFetchImages: () => void;
    SignUpButton?: ReactElement &React.ComponentPropsWithoutRef<typeof WhiteButton>
}

function useInternalNavigation({
	userData,
	setUserData,
	requestFetchImages,
}: NavigationButtonsProps): [boolean, () => void, () => void] {
	const [signingOut, requestSignOut] = useSignOut(
		userData,
		setUserData,
		handleSignOutSuccess
	);
	const navigate = useNavigate();

	function handleSignOutSuccess() {
		requestFetchImages();
		return EventEmitter.emit("success", "SUCCESSFULLY SIGNED OUT!");
	}

	function requestAddImage() {
		if (userData === undefined) {
			return EventEmitter.emit(
				"error",
				"PLEASE TRY AGAIN IN A LITTLE WHILE"
			);
		}

		if (!userData) {
			return EventEmitter.emit(
				"error",
				"YOU MUST BE SIGNED IN TO ADD A NEW IMAGE"
			);
		}

		return navigate("/add-image");
	}

	return [signingOut, requestSignOut, requestAddImage];
}

function NavigationButtons({
	userData,
	setUserData,
	requestFetchImages,
}: NavigationButtonsProps) {
	const [signingOut, requestSignOut, requestAddImage] = useInternalNavigation(
		{ userData, setUserData, requestFetchImages }
	);
	return (
		<NavigationButtonsContainer>
			{(() => {
				if (userData === undefined) {
					return <></>;
				}

				if (userData === false) {
					return (
						<>
							<Link to="/sign-up">
								<WhiteButton text="SIGN UP" />
							</Link>
							<Link to="/sign-in">
								<WhiteButton text="SIGN IN" />
							</Link>
						</>
					);
				}

				//userData must exist at this point
				return (
					<>
						<span style={{ fontWeight: "bold" }}>
							{userData.username}
						</span>
						<WhiteButton
							onClick={() => {
								requestSignOut();
							}}
							text="SIGN OUT"
						/>
					</>
				);
			})()}
			<WhiteButton onClick={requestAddImage} text="ADD IMAGE" />
		</NavigationButtonsContainer>
	);
}

const NavigationOuterContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: ${desktopConstants.smallGap};
	padding-left: 0px;
	padding-right: 0px;
	align-items: center;
	box-sizing: border-box;
`;

const NavigationInnerContainer = styled.div`
	width: ${desktopConstants.mainContentWidth};
	display: flex;
	justify-content: space-between;
	align-items: baseline;
`;

interface NavigationProps extends NavigationButtonsProps {}

function Navigation({
	userData,
	setUserData,
	requestFetchImages,
}: NavigationProps) {
	return (
		<NavigationOuterContainer>
			<NavigationInnerContainer>
				<ImagesNumber shown={3} total={10} />
				<NavigationButtons
					userData={userData}
					setUserData={setUserData}
					requestFetchImages={requestFetchImages}
				/>
			</NavigationInnerContainer>
		</NavigationOuterContainer>
	);
}

//////////////////////////////////////////////////////////// MOBILE COMPONENTS ////////////////////////////////////////////////////////////

const MobileNavigationContainer = styled(NavigationButtonsContainer)`
	flex-direction: column;
	gap: ${mobileConstants.mediumSmallGap};
	align-items: flex-end;
`;

function MobileNavigation({
	userData,
	setUserData,
	requestFetchImages,
}: NavigationProps) {
	const [signingOut, requestSignOut, requestAddImage] = useInternalNavigation(
		{
			userData,
			setUserData,
			requestFetchImages,
		}
	);

	return (
		<MobileNavigationContainer>
			{(() => {
				if (userData === undefined) {
					return <></>;
				}

				if (userData === false) {
					return (
						<>
							<Link to="/sign-up">
								<MobileWhiteButton text="SIGN UP" />
							</Link>
							<Link to="/sign-in">
								<MobileWhiteButton text="SIGN IN" />
							</Link>
						</>
					);
				}

				// userData must exist at this point
				return (
					<>
						<span style={{ fontWeight: "bold" }}>
							{userData.username}
						</span>
						<MobileWhiteButton
							onClick={() => {
								requestSignOut();
							}}
							text="SIGN OUT"
						/>
					</>
				);
			})()}

			<MobileWhiteButton onClick={requestAddImage} text="ADD IMAGE" />
		</MobileNavigationContainer>
	);
}


export { Navigation, MobileNavigation };
