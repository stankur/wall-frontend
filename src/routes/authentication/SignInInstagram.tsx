import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInternalUserData } from "../../App";
import { ResponsiveAuthenticationCard } from "../../components/AuthenticationCard";
import { ResponsivePlainLogoHero } from "../../components/Hero";
import {
	CenteredColumnContainer,
	Page,
	ResponsiveDescription,
} from "../../components/Utils";
import {
	useInstagramUsername,
	useSignIn,
} from "../../hooks/authenticationHooks";
import { DeviceContext } from "../../hooks/deviceHooks";
import { UserData } from "../../types/types";
import { EventEmitter } from "../../Utils";

function SignInInstagram() {
	const navigate = useNavigate();
	const device = useContext(DeviceContext);
	const [userData, setUserData] = useInternalUserData();
	const [signingIn, requestSignIn] = useSignIn(
		userData,
		setUserData,
		handleSignInSuccess
	);

	const [username, isAcceptable, requestChangeUsername] =
		useInstagramUsername();
	const [password, setPassword] = useState("");

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
					buttonText={signingIn ? "LOADING..." : "SIGN IN"}
					onSubmitClick={signingIn ? () => {} : onSubmitClick}
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
		</Page>
	);
}

export default SignInInstagram;