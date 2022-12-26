import { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ResponsiveEmptyAuthenticationCard } from "../../components/AuthenticationCard";
import { ResponsivePlainLogoHero } from "../../components/Hero";
import {
	CenteredColumnContainer,
	Page,
	ResponsiveDescription,
	ResponsiveLongButton,
	ResponsiveLongButtonImage,
	ResponsiveLongButtonText,
    ResponsiveRedirectSuggestionContainer,
    ResponsiveWhiteButton,
} from "../../components/Utils";
import { desktopConstants, mobileConstants } from "../../constants/ComponentConstants";
import { DeviceContext } from "../../hooks/deviceHooks";
import { Device } from "../../types/types";

interface SignUpWithInstagramProps {
	device: Device;
}

function SignUpWithInstagram({ device }: SignUpWithInstagramProps) {
	return (
		<ResponsiveLongButton device={device}>
			<ResponsiveLongButtonImage device={device} src="/ig.png" />
			<ResponsiveLongButtonText
				device={device}
				text="SIGN UP WITH INSTAGRAM"
			/>
		</ResponsiveLongButton>
	);
}

interface SignUpWithEmailProps {
	device: Device;
}

function SignUpWithEmail({ device }: SignUpWithEmailProps) {
	return (
		<ResponsiveLongButton device={device}>
			<ResponsiveLongButtonImage device={device} src="/mail.png" />
			<ResponsiveLongButtonText device={device} text="SIGN UP WITH EMAIL" />
		</ResponsiveLongButton>
	);
};

interface SignUpMethodsProps {
	device: Device;
}

function SignUpMethods({ device }: SignUpMethodsProps) {
	return (
		<>
			<Link
				to="/sign-up-with-email"
				style={{ textDecoration: "none", color: "black" }}
			>
				<SignUpWithEmail device={device} />
			</Link>
			<Link
				to="/sign-up-with-instagram"
				style={{ textDecoration: "none", color: "black" }}
			>
				<SignUpWithInstagram device={device} />
			</Link>
		</>
	);
}

interface SignUpMethodsGroupContainerProps {
	device: Device;
}

const SignUpMethodsGroupContainer = styled.div<SignUpMethodsGroupContainerProps>`
	width: 100%;
	height: 100%;

	display: flex;
	flex-direction: column;

	align-items: stretch;
	justify-content: center;

	padding: ${(props) =>
		props.device === "mobile"
			? mobileConstants.mediumGap
			: desktopConstants.mediumGap};
	box-sizing: border-box;

	gap: ${(props) =>
		props.device === "mobile"
			? mobileConstants.mediumGap
			: desktopConstants.mediumGap};
`;

interface SignUpMethodsGroupProps {
	device: Device;
}

function SignUpMethodsGroup({ device }: SignUpMethodsGroupProps) {
	return (
		<SignUpMethodsGroupContainer device={device}>
			<span
				style={{
					fontSize: desktopConstants.regularFontSize,
					fontWeight: "bold",
				}}
			>
				CHOOSE SIGN UP METHOD
			</span>
			<SignUpMethods device={device} />
		</SignUpMethodsGroupContainer>
	);
}

function ChooseSignUp() {
	const device = useContext(DeviceContext);
	return (
		<Page>
			<ResponsivePlainLogoHero device={device} />
			<div style={{ textAlign: "center" }}>
				<ResponsiveDescription device={device}>
					CREATE NEW ACCOUNT
				</ResponsiveDescription>
			</div>
			<CenteredColumnContainer>
				<ResponsiveEmptyAuthenticationCard
					device={device}
					content={<SignUpMethodsGroup device={device} />}
				/>
			</CenteredColumnContainer>
			<div style={{ textAlign: "center" }}>
				<ResponsiveDescription device={device}>
					<ResponsiveRedirectSuggestionContainer device={device}>
						<span>HAVE AN ACCOUNT?</span>
						<Link
							to="/sign-in"
						>
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

export default ChooseSignUp;
