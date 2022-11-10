import React, { ReactNode, useContext } from "react";
import {
	Page,
	CenteredColumnContainer,
	ResponsiveDescription,
    ResponsiveWhiteButton,
} from "../components/Utils";
import {  ResponsivePlainLogoHero } from "../components/Hero";
import  { ResponsiveAuthenticationCard } from "../components/AuthenticationCard";

import styled from "styled-components";
import {desktopConstants, mobileConstants} from "../constants/ComponentConstants";
import { Link, useNavigate } from "react-router-dom";
import { useInternalUserData } from "../App";
import { useSignUp } from "../hooks/authenticationHooks";
import { Device, UserData } from "../types/types";
import { EventEmitter } from "../Utils";
import { DeviceContext } from "../hooks/deviceHooks";

const RedirectSuggestionContainer = styled.div`
	display: inline-flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: ${desktopConstants.smallGap};
`;

const MobileRedirectSuggestionContainer = styled(RedirectSuggestionContainer)`
	gap: ${mobileConstants.smallGap};
`;

interface ResponsiveRedirectSuggestionContainerProps {
	device: Device;
	children: ReactNode;
}

function ResponsiveRedirectSuggestionContainer({
	device,
	children,
}: ResponsiveRedirectSuggestionContainerProps) {
	if (device === "mobile") {
		return (
			<MobileRedirectSuggestionContainer>
				{children}
			</MobileRedirectSuggestionContainer>
		);
	}

	return (
		<RedirectSuggestionContainer>{children}</RedirectSuggestionContainer>
	);
}

function SignUp() {
	const [userData, setUserData] = useInternalUserData();
	const [signingUp, requestSignUp] = useSignUp(
		userData,
		setUserData,
		handleSignUpSuccess
	);
	const device = useContext(DeviceContext);
	const navigate = useNavigate();

	function handleSignUpSuccess(userData: UserData) {
		navigate("/");
		EventEmitter.emit("success", `WELCOME TO WALL, ${userData.username}!`);
	}

	return (
		<Page>
			<ResponsivePlainLogoHero device={device} />
			<div style={{ textAlign: "center" }}>
				<ResponsiveDescription device={device}>
					SIGN UP TO JOIN WALL
				</ResponsiveDescription>
			</div>
			<CenteredColumnContainer>
				<ResponsiveAuthenticationCard
					device={device}
					submitUsernamePassword={requestSignUp}
					buttonText="JOIN WALL"
					passwordDescription="AT LEAST 10 CHARACTERS"
					usernameDescription="5 - 30 UPPERCASE ALPHANUMERIC"
				/>
			</CenteredColumnContainer>
			<div style={{ textAlign: "center" }}>
				<ResponsiveDescription device={device}>
					<ResponsiveRedirectSuggestionContainer device={device}>
						<span>HAVE AN ACCOUNT?</span>
						<Link to="/sign-in">
							<ResponsiveWhiteButton
								text="SIGN IN"
								onClick={() => {}}
								device={device}
							/>
						</Link>
						<span>INSTEAD</span>
					</ResponsiveRedirectSuggestionContainer>
				</ResponsiveDescription>
			</div>
		</Page>
	);
}

export default SignUp;
