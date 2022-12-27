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
import {
	desktopConstants,
	mobileConstants,
} from "../../constants/ComponentConstants";
import { DeviceContext } from "../../hooks/deviceHooks";
import { Device } from "../../types/types";
interface SignInInstagramProps {
	device: Device;
}

function SignInInstagram({ device }: SignInInstagramProps) {
	return (
		<ResponsiveLongButton device={device}>
			<ResponsiveLongButtonImage device={device} src="/ig.png" />
			<ResponsiveLongButtonText
				device={device}
				text="INSTAGRAM-LINKED ACCOUNT SIGN IN"
			/>
		</ResponsiveLongButton>
	);
}

interface SignInRegularProps {
	device: Device;
}

function SignInRegular({ device }: SignInRegularProps) {
	return (
		<ResponsiveLongButton device={device}>
			<ResponsiveLongButtonImage device={device} src="/mail.png" />
			<ResponsiveLongButtonText
				device={device}
				text="REGULAR ACCOUNT SIGN IN"
			/>
		</ResponsiveLongButton>
	);
}

interface SignInMethodsProps {
	device: Device;
}

function SignInMethods({ device }: SignInMethodsProps) {
	return (
		<>
			<Link
				to="/sign-in-regular"
				style={{ textDecoration: "none", color: "black" }}
			>
				<SignInRegular device={device} />
			</Link>
			<Link
				to="/sign-in-instagram"
				style={{ textDecoration: "none", color: "black" }}
			>
				<SignInInstagram device={device} />
			</Link>
		</>
	);
}

interface SignInMethodsGroupContainerProps {
	device: Device;
}

const SignInMethodsGroupContainer = styled.div<SignInMethodsGroupContainerProps>`
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

interface SignInMethodsGroupProps {
	device: Device;
}

function SignInMethodsGroup({ device }: SignInMethodsGroupProps) {
	return (
		<SignInMethodsGroupContainer device={device}>
			<span
				style={{
					fontSize:
						device === "mobile"
							? mobileConstants.regularFontSize
							: desktopConstants.regularFontSize,
				}}
			>
				CHOOSE SIGN IN METHOD
			</span>
			<SignInMethods device={device} />
		</SignInMethodsGroupContainer>
	);
}

function ChooseSignIn() {
	const device = useContext(DeviceContext);
	return (
		<Page>
			<ResponsivePlainLogoHero device={device} />
			<div style={{ textAlign: "center" }}>
				<ResponsiveDescription device={device}>
					SIGN IN TO EXISTING ACCOUNT
				</ResponsiveDescription>
			</div>
			<CenteredColumnContainer>
				<ResponsiveEmptyAuthenticationCard
					device={device}
					content={<SignInMethodsGroup device={device} />}
				/>
			</CenteredColumnContainer>
			<div style={{ textAlign: "center" }}>
				<ResponsiveDescription device={device}>
					<ResponsiveRedirectSuggestionContainer device={device}>
						<span>NO ACCOUNT?</span>
						<Link to={"/sign-up"}>
							<ResponsiveWhiteButton
								device={device}
								text="SIGN UP"
							/>
						</Link>
					</ResponsiveRedirectSuggestionContainer>
				</ResponsiveDescription>
			</div>
		</Page>
	);
}


export default ChooseSignIn;