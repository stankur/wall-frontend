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
import {desktopConstants} from "../constants/ComponentConstants";
import { Link, useNavigate } from "react-router-dom";
import { useInternalUserData } from "../App";
import { useSignUp } from "../hooks/authenticationHooks";
import { UserData } from "../types/types";
import { EventEmitter } from "../Utils";

const RedirectSuggestionContainer = styled.div`
	display: inline-flex;
	padding-top: ${desktopConstants.bigGap};
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: ${desktopConstants.smallGap};
	width: ${desktopConstants.mainContentWidth};
	font-size: ${desktopConstants.regularFontSize};
`;

function SignUp() {
	const [userData, setUserData] = useInternalUserData();
	const [signingUp, requestSignUp] = useSignUp(
		userData,
		setUserData,
		handleSignUpSuccess
	);
	const navigate = useNavigate();

	function handleSignUpSuccess(userData: UserData) {
		navigate("/");
		EventEmitter.emit("success", `WELCOME TO WALL, ${userData.username}!`);
	}

	return (
		<Page>
			<LogoHero />
			<div style={{ textAlign: "center" }}>
				<Description>CREATE AN ACCOUNT</Description>
			</div>
			<CenteredColumnContainer>
				<AuthenticationCard
					submitUsernamePassword={requestSignUp}
					buttonText="JOIN WALL"
					passwordDescription="AT LEAST 10 CHARACTERS"
					usernameDescription="5 - 30 UPPERCASE ALPHANUMERIC"
				/>
			</CenteredColumnContainer>
			<div style={{ textAlign: "center" }}>
				<RedirectSuggestionContainer>
					<span> ALREADY HAVE AN ACCOUNT?</span>
					<Link to="/sign-in">
						<WhiteButton text="SIGN IN" onClick={() => {}} />
					</Link>
					<span>INSTEAD</span>
				</RedirectSuggestionContainer>
			</div>
		</Page>
	);
}

export default SignUp;
