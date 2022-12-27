import { FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveAuthenticationCard } from "../../components/AuthenticationCard";
import { ResponsivePlainLogoHero } from "../../components/Hero";
import {
	CenteredColumnContainer,
	Page,
	ResponsiveDescription,
} from "../../components/Utils";
import { useInstagramUsername } from "../../hooks/authenticationHooks";
import { DeviceContext } from "../../hooks/deviceHooks";
import { EventEmitter, generateVerificationCode } from "../../Utils";

function SignUpWithInstagram() {
	const [username, isAcceptable, requestChangeUsername] = useInstagramUsername();
	const device = useContext(DeviceContext);

	const navigate = useNavigate();

	function onSubmitClick() {
		if (!isAcceptable) {
			return EventEmitter.emit(
				"error",
				"INSTAGRAM USERNAME GIVEN IS INVALID"
			);
		}
		return navigate("/verify-instagram", {
			state: {
				username,
                verificationCode: generateVerificationCode()
			},
		});
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
					labeledInputData={[
						{
							name: "INSTAGRAM USERNAME",
							description: "THIS WILL BE YOUR WALL USERNAME TOO",
							value: username,
							onChange: (e: FormEvent<HTMLInputElement>) =>
								requestChangeUsername(e.currentTarget.value),
						},
					]}
					buttonText="VERIFY INSTAGRAM"
					onSubmitClick={onSubmitClick}
				/>
			</CenteredColumnContainer>
		</Page>
	);
}

export default SignUpWithInstagram;
