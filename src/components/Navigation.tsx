import React, { ReactElement, useEffect } from "react";
import styled from "styled-components";
import {desktopConstants, mobileConstants} from "../constants/ComponentConstants";
import { LogoContainer, MobileWhiteButton, WhiteButton } from "./Utils";
import { Link, useNavigate } from "react-router-dom";
import { UserDataState, useSignOut } from "../hooks/authenticationHooks";
import { EventEmitter } from "../Utils";
import { useIsSticky } from "../hooks/componentHooks";
import { Device } from "../types/types";


const NavigationButtonsContainer = styled.span`
	display: inline-flex;
	align-items: center;
	gap: ${desktopConstants.smallGap};
`;

interface NavigationButtonsProps {
	userData: UserDataState;
	setUserData: React.Dispatch<React.SetStateAction<UserDataState>>;
	onSignOutSuccess: () => void;
	SignUpButton?: ReactElement &
		React.ComponentPropsWithoutRef<typeof WhiteButton>;
}

function useInternalNavigation({
	userData,
	setUserData,
	onSignOutSuccess,
}: NavigationButtonsProps): [boolean, () => void, () => void] {
	const [signingOut, requestSignOut] = useSignOut(
		userData,
		setUserData,
		handleSignOutSuccess
	);
	const navigate = useNavigate();

	function handleSignOutSuccess() {
		onSignOutSuccess();
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
				"YOU MUST BE SIGNED IN TO ADD A NEW IMAGE, JOIN WALL TO ENJOY MUCH MORE"
			);
		}

		return navigate("/add-image");
	}

	return [signingOut, requestSignOut, requestAddImage];
}

function NavigationButtons({
	userData,
	setUserData,
	onSignOutSuccess,
}: NavigationButtonsProps) {
	const [signingOut, requestSignOut, requestAddImage] = useInternalNavigation(
		{ userData, setUserData, onSignOutSuccess }
	);
	return (
		<NavigationButtonsContainer>
			<WhiteButton onClick={requestAddImage} text="ADD IMAGE" />

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
						<WhiteButton
							onClick={() => {
								requestSignOut();
							}}
							text="SIGN OUT"
						/>
						<span style={{ fontWeight: "bold" }}>
							{userData.username}
						</span>
					</>
				);
			})()}
		</NavigationButtonsContainer>
	);
}

const NavigationLogoContainer = styled(LogoContainer)`
	font-size: ${desktopConstants.navigationLogoFontSize};
	padding: 0;
    text-shadow: none;
`;

const NavigationOuterContainer = styled.div`
	display: flex;
	width: 100%;
	padding: ${desktopConstants.smallGap};
	padding-left: 0px;
	padding-right: 0px;
	justify-content: center;
	box-sizing: border-box;

	position: sticky;
	top: -1px;

	z-index: 2;

	&.isSticky {
		padding: ${desktopConstants.mediumSmallerGap};

		border-bottom: 1px solid black;
		box-shadow: 2px 0px 9px rgba(0, 0, 0, 0.55);

		background-color: rgb(
			${desktopConstants.backgroundLite[0]},
			${desktopConstants.backgroundLite[1]},
			${desktopConstants.backgroundLite[2]}
		);
	}
`;

const NavigationInnerContainer = styled.div`
	width: ${desktopConstants.mainContentWidth};
	display: flex;
	justify-content: center;
	align-items: baseline;

	&.isSticky {
		width: 100%;
		align-items: center;
		justify-content: space-between;
	}
`;

interface NavigationProps extends NavigationButtonsProps {
}

function Navigation({
	userData,
	setUserData,
	onSignOutSuccess,
}: NavigationProps) {
	const [ref, isSticky] = useIsSticky();
	return (
		<NavigationOuterContainer
			ref={ref}
			className={isSticky ? "isSticky" : ""}
		>
			<NavigationInnerContainer className={isSticky ? "isSticky" : ""}>
				{isSticky && (
					<NavigationLogoContainer>WALL</NavigationLogoContainer>
				)}
				<NavigationButtons
					userData={userData}
					setUserData={setUserData}
					onSignOutSuccess={onSignOutSuccess}
				/>
			</NavigationInnerContainer>
		</NavigationOuterContainer>
	);
}

//////////////////////////////////////////////////////////// MOBILE COMPONENTS ////////////////////////////////////////////////////////////

const MobileNavigationButtonsContainer = styled(NavigationButtonsContainer)`
	gap: ${mobileConstants.mediumSmallGap};
`;

function MobileNavigationButtons({
	userData,
	setUserData,
	onSignOutSuccess,
}: NavigationButtonsProps) {
	const [signingOut, requestSignOut, requestAddImage] = useInternalNavigation(
		{
			userData,
			setUserData,
			onSignOutSuccess,
		}
	);

	return (
		<MobileNavigationButtonsContainer>
			<MobileWhiteButton onClick={requestAddImage} text="ADD IMAGE" />

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
						<MobileWhiteButton
							onClick={() => {
								requestSignOut();
							}}
							text="SIGN OUT"
						/>
						<span style={{ fontWeight: "bold" }}>
							{userData.username}
						</span>
					</>
				);
			})()}
		</MobileNavigationButtonsContainer>
	);
};

const MobileNavigationOuterContainer = styled(NavigationOuterContainer)`
	padding: ${mobileConstants.mediumGap};

	&.isSticky {
		padding: ${mobileConstants.mediumSmallGap};
	}
`;

const MobileNavigationInnerContainer = styled(NavigationInnerContainer)`
	width: ${mobileConstants.mainContentWidth};
	&.isSticky {
        justify-content: center;
	}
`;
function MobileNavigation({
	userData,
	setUserData,
	onSignOutSuccess,
}: NavigationProps) {
	const [ref, isSticky] = useIsSticky();

	return (
		<MobileNavigationOuterContainer
			ref={ref}
			className={isSticky ? "isSticky" : ""}
		>
			<MobileNavigationInnerContainer
				className={isSticky ? "isSticky" : ""}
			>
				<MobileNavigationButtons
					userData={userData}
					setUserData={setUserData}
					onSignOutSuccess={onSignOutSuccess}
				/>
			</MobileNavigationInnerContainer>
		</MobileNavigationOuterContainer>
	);
}

//////////////////////////////////////////////////////////// RESPONSIVE COMPONENTS ////////////////////////////////////////////////////////////

interface ResponsiveNavigationProps extends NavigationProps {
    device: Device
}

function ResponsiveNavigation({
	userData,
	setUserData,
	onSignOutSuccess,
	device,
}: ResponsiveNavigationProps) {
	if (device === "mobile") {
		return (
			<>
				<MobileNavigation
					userData={userData}
					setUserData={setUserData}
					onSignOutSuccess={onSignOutSuccess}
				/>
				<div style={{ height: mobileConstants.mediumLargeGap }} />
			</>
		);
	}

	return (
		<>
			<Navigation
				userData={userData}
				setUserData={setUserData}
				onSignOutSuccess={onSignOutSuccess}
			/>
			<div style={{ height: desktopConstants.humongousGap }} />
		</>
	);
};

export { ResponsiveNavigation };
