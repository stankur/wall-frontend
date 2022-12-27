import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useInternalUserData } from "../../App";
import { ResponsiveAuthenticationCard } from "../../components/AuthenticationCard";
import { ResponsivePlainLogoHero } from "../../components/Hero";
import { CenteredColumnContainer, Page, ResponsiveDescription, ResponsiveRedirectSuggestionContainer, ResponsiveWhiteButton } from "../../components/Utils";
import { useSignUpWithInstagram } from "../../hooks/authenticationHooks";
import { DeviceContext } from "../../hooks/deviceHooks";
import { UserData } from "../../types/types";
import { EventEmitter } from "../../Utils";

function SignUpWithInstagramVerified() {
	const location = useLocation();
	const navigate = useNavigate();
	const device = useContext(DeviceContext);
	const [userData, setUserData] = useInternalUserData();
	const [signingUp, requestSignUp] = useSignUpWithInstagram(
		userData,
		setUserData,
		handleSignUpSuccess
	);

	const [password, setPassword] = useState("");

	function onSubmitClick() {
		requestSignUp(getStateData().username, password);
	}

	function handleSignUpSuccess(userData: UserData) {
		navigate("/");
		EventEmitter.emit("success", `WELCOME TO WALL, ${userData.username}!`);
	}

	function getStateData(): {
		username: string;
	} {
		const username = location.state.username;

		return {
			username,
		};
	}

	return (
		<Page>
			<ResponsivePlainLogoHero device={device} />
			<div style={{ textAlign: "center" }}>
				<ResponsiveDescription device={device}>
					CREATE NEW ACCOUNT
				</ResponsiveDescription>
			</div>
			<CenteredColumnContainer>
				<ResponsiveAuthenticationCard
					device={device}
					buttonText={signingUp ? "LOADING..." : "JOIN WALL"}
					onSubmitClick={onSubmitClick}
					labeledInputData={[
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
					</ResponsiveRedirectSuggestionContainer>
				</ResponsiveDescription>
			</div>
		</Page>
	);
}

export default SignUpWithInstagramVerified;
