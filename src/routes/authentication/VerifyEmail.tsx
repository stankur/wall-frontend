import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInternalUserData } from "../../App";
import { ResponsiveAuthenticationCard } from "../../components/AuthenticationCard";
import { ResponsivePlainLogoHero } from "../../components/Hero";
import { ResponsiveNavigation } from "../../components/Navigation";
import { CenteredColumnContainer, Page, ResponsiveDescription } from "../../components/Utils";
import { useSignUpWithEmail } from "../../hooks/authenticationHooks";
import { DeviceContext } from "../../hooks/deviceHooks";
import { UserData } from "../../types/types";
import { EventEmitter } from "../../Utils";

function VerifyEmail() {
	const [verificationCode, setVerificationCode] = useState("");
	const [password, setPassword] = useState("");
	const [userData, setUserData] = useInternalUserData();

	const [signingUp, requestSignUp] = useSignUpWithEmail(
		userData,
		setUserData,
		handleSignUpSuccess
	);

	const location = useLocation();
	const navigate = useNavigate();

	const device = useContext(DeviceContext);

	function getStateData() :{
		username: string;
		email: string;
		trueVerificationCode: string;
	}{
		const username = location.state.username;
		const email = location.state.email;
		const trueVerificationCode = location.state.verificationCode;

		return {
			username,
			email,
			trueVerificationCode,
		};
	}


	function onSubmitClick() {
		let { username, email, trueVerificationCode } = getStateData();

		if (verificationCode !== trueVerificationCode) {
			return EventEmitter.emit("error", "WRONG VERIFICATION CODE");
		}

		requestSignUp(username, email, password);
	}


	function handleSignUpSuccess(userData: UserData) {
		navigate("/");
		EventEmitter.emit("success", `WELCOME TO WALL, ${userData.username}!`);
	}

	if (
		!location.state ||
		!getStateData().username ||
		!getStateData().email ||
		!getStateData().trueVerificationCode
	) {
		return (
			<Page>
				<ResponsivePlainLogoHero device={device}>
					<ResponsiveNavigation
						userData={userData}
						setUserData={setUserData}
						onSignOutSuccess={() => navigate("/")}
						device={device}
					/>
				</ResponsivePlainLogoHero>
				<CenteredColumnContainer>
					<span>
						This page is not working because it could only be
						accesed directly from the main sign up page
					</span>
				</CenteredColumnContainer>
			</Page>
		);
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
					buttonText="JOIN WALL"
					onSubmitClick={onSubmitClick}
					labeledInputData={[
						{
							name: "6-DIGITS VERIFICATION CODE",
							description: "CHECK YOUR EMAIL INBOX AND SPAM",
							value: verificationCode,
							onChange: (e) =>
								setVerificationCode(e.currentTarget.value),
						},
						{
							name: "PASSWORD",
							description: "AT LEAST 10 CHARACTERS",
							value: password,
							type: "password",
							onChange: (e) => setPassword(e.currentTarget.value),
						},
					]}
				/>
			</CenteredColumnContainer>
		</Page>
	);
}

export default VerifyEmail;
