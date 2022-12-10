import React, { ReactNode, useContext, useState } from "react";
import {
	Page,
	CenteredColumnContainer,
	ResponsiveDescription,
	ResponsiveWhiteButton,
} from "../components/Utils";
import { ResponsivePlainLogoHero } from "../components/Hero";
import { ResponsiveAuthenticationCard } from "../components/AuthenticationCard";

import styled from "styled-components";
import {
	desktopConstants,
	mobileConstants,
} from "../constants/ComponentConstants";
import { Link, useNavigate } from "react-router-dom";
import { useInternalUserData } from "../App";
import { useSignIn, useUsername } from "../hooks/authenticationHooks";
import { EventEmitter } from "../Utils";
import { Device, UserData } from "../types/types";
import { DeviceContext } from "../hooks/deviceHooks";
import { ResponsiveNavigation } from "../components/Navigation";

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

function SignIn() {
	const navigate = useNavigate();
	const [userData, setUserData] = useInternalUserData();
	const [signingIn, requestSignIn] = useSignIn(
		userData,
		setUserData,
		handleSignInSuccess
	);

	const [username, requestChangeUsername] = useUsername();
	const [password, setPassword] = useState("");

	const device = useContext(DeviceContext);

	function handleSignInSuccess(userData: UserData) {
		navigate("/");
		EventEmitter.emit("success", `WELCOME TO WALL, ${userData.username}!`);
	}

	function onSubmitClick() {
		return requestSignIn(username, password);
	}

	return (
		<Page>
			<ResponsivePlainLogoHero device={device} />
			<div style={{ textAlign: "center" }}>
				<ResponsiveDescription device={device}>
					SIGN IN TO EXISTING ACCOUNT
				</ResponsiveDescription>
			</div>
			<CenteredColumnContainer>
				<ResponsiveAuthenticationCard
					device={device}
					onSubmitClick={onSubmitClick}
					buttonText="SIGN IN"
					labeledInputData={[
						{
							name: "USERNAME",
							value: username,
							onChange: (event) =>
								requestChangeUsername(
									event.currentTarget.value
								),
						},
						{
							name: "PASSWORD",
							value: password,
							type: "password",
							onChange: (event) =>
								setPassword(event.currentTarget.value),
						},
					]}
				/>
			</CenteredColumnContainer>
			<div style={{ textAlign: "center" }}>
				<ResponsiveDescription device={device}>
					<ResponsiveRedirectSuggestionContainer device={device}>
						<span>DON'T HAVE AN ACCOUNT?</span>
						<Link to={"/sign-up"}>
							<ResponsiveWhiteButton
								device={device}
								text="SIGN UP"
							/>
						</Link>
						<span>INSTEAD</span>
					</ResponsiveRedirectSuggestionContainer>
				</ResponsiveDescription>
			</div>
		</Page>
	);
}

export default SignIn;
