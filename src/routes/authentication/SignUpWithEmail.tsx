import { FormEvent, ReactNode, useContext, useState } from "react";
import {
	Page,
	CenteredColumnContainer,
	ResponsiveDescription,
	ResponsiveWhiteButton,
} from "../../components/Utils";
import { ResponsivePlainLogoHero } from "../../components/Hero";
import { ResponsiveAuthenticationCard } from "../../components/AuthenticationCard";

import styled from "styled-components";
import {
	desktopConstants,
	mobileConstants,
} from "../../constants/ComponentConstants";
import { Link, useNavigate } from "react-router-dom";
import {
	useUsername,
	useVerifyEmail,
	validatePreEmailVerificationInputs,
} from "../../hooks/authenticationHooks";
import { useInternalUserData } from "../../App";

import { Device } from "../../types/types";
import { EventEmitter } from "../../Utils";
import { DeviceContext } from "../../hooks/deviceHooks";

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

function SignUpWithEmail() {
	const [username, requestChangeUsername] = useUsername();
	const [email, setEmail] = useState<string>("");
	const [userData] = useInternalUserData();
	const [sendingEmail, requestSendVerification] = useVerifyEmail(
		onSendEmailSuccess,
		onSendEmailFail
	);

	const device = useContext(DeviceContext);
	const navigate = useNavigate();

	function onSendEmailFail(err: Error) {
		return EventEmitter.emit("error", err.message);
	}

	function onSendEmailSuccess(verificationCode: string) {
		return navigate("/verify-email", {
			state: {
				username,
				email,
				verificationCode,
			},
		});
	}

	function onSubmitClick() {
		try {
			validatePreEmailVerificationInputs(userData, username, email);
		} catch (err) {
			return EventEmitter.emit("error", (err as Error).message);
		}

		return requestSendVerification(email);
	}

	return (
		<Page>
			<ResponsivePlainLogoHero device={device} />
			<div style={{ textAlign: "center" }}>
				<ResponsiveDescription device={device}>
					CREATE AN ACCOUNT
				</ResponsiveDescription>
			</div>
			<CenteredColumnContainer>
				<ResponsiveAuthenticationCard
					device={device}
					labeledInputData={[
						{
							name: "USERNAME",
							description: "5 - 30 UPPERCASE ALPHANUMERIC",
							value: username,
							onChange: (e: FormEvent<HTMLInputElement>) =>
								requestChangeUsername(e.currentTarget.value),
						},
						{
							name: "EMAIL",
							description: "ONLY FOR VERIFICATION PURPOSE",
							value: email,
							onChange: (e: FormEvent<HTMLInputElement>) =>
								setEmail(e.currentTarget.value),
						},
					]}
					buttonText="VERIFY EMAIL"
					onSubmitClick={onSubmitClick}
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

export default SignUpWithEmail;
