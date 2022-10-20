import React from "react";
import {
	Page,
	CenteredColumnContainer,
	WhiteButton,
} from "../components/Utils";
import { LogoHero } from "../components/Hero";
import AuthenticationCard from "../components/AuthenticationCard";

import styled from "styled-components";
import constants from "../components/constants";
import { Link, useNavigate } from "react-router-dom";

const Description = styled.div`
	display: inline-block;
	padding-bottom: ${constants.bigGap};
	text-align: left;
	font-size: ${constants.regularFontSize};
	width: ${constants.mainContentWidth};
`;

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
	return (
		<Page>
			<LogoHero />
			<div style={{ textAlign: "center" }}>
				<Description>SIGN IN TO EXISTING ACCOUNT</Description>
			</div>
			<CenteredColumnContainer>
				<AuthenticationCard
					submitUsernamePassword={() => {
						navigate("/");
					}}
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
