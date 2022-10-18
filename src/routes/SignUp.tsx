import React from "react";
import { Page, CenteredColumnContainer, WhiteButton } from "../components/Utils";
import { LogoHero } from "../components/Hero";
import AuthenticationCard from "../components/AuthenticationCard";

import styled from "styled-components";
import constants from "../components/constants";
import { Link } from "react-router-dom";

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

function SignUp() {
	return (
		<Page>
			<LogoHero />
			<div style={{ textAlign: "center" }}>
				<Description>CREATE AN ACCOUNT</Description>
			</div>
			<CenteredColumnContainer>
				<AuthenticationCard
					buttonOnClick={() => {}}
					buttonText="JOIN WALL"
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