import React from "react";
import {
	Page,
	CenteredColumnContainer,
	WhiteButton,
	Description,
} from "../components/Utils";
import { LogoHero } from "../components/Hero";
import AuthenticationCard from "../components/AuthenticationCard";

import styled from "styled-components";
import constants from "../constants/ComponentConstants";
import { Link, useNavigate } from "react-router-dom";
import { useInternalUserData } from "../App";
import { useSignIn } from "../hooks/authenticationHooks";
import { EventEmitter } from "../Utils";
import { UserData } from "../types/types";


const RedirectSuggestionContainer = styled.div`
	display: inline-flex;
	padding-top: ${constants.bigGap};
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: ${constants.smallGap};
	width: ${constants.mainContentWidth};
	font-size: ${constants.regularFontSize};
`;

function SignIn() {
	const navigate = useNavigate();
	const [userData, setUserData] = useInternalUserData();
	const [signingIn, requestSignIn] = useSignIn(
		userData,
		setUserData,
		handleSignInSuccess
	);

	function handleSignInSuccess(userData: UserData) {
		navigate("/");
		EventEmitter.emit("success", `WELCOME TO WALL, ${userData.username}!`);
	}

	return (
		<Page>
			<LogoHero />
			<div style={{ textAlign: "center" }}>
				<Description>SIGN IN TO EXISTING ACCOUNT</Description>
			</div>
			<CenteredColumnContainer>
				<AuthenticationCard
					submitUsernamePassword={requestSignIn}
					buttonText="SIGN IN"
				/>
			</CenteredColumnContainer>
			<div style={{ textAlign: "center" }}>
				<RedirectSuggestionContainer>
					<span> DON'T HAVE AN ACCOUNT?</span>
					<Link to={"/sign-up"}>
						<WhiteButton text="CREATE ACCOUNT" />
					</Link>
					<span>INSTEAD</span>
				</RedirectSuggestionContainer>
			</div>
		</Page>
	);
}

export default SignIn;
