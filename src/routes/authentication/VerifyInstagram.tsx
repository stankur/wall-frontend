import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { ResponsiveEmptyAuthenticationCard } from "../../components/AuthenticationCard";
import { ResponsivePlainLogoHero } from "../../components/Hero";
import {
	CenteredColumnContainer,
	Page,
	ResponsiveBackgroundColorButton,
	ResponsiveDescription,
    ResponsiveRedirectSuggestionContainer,
    ResponsiveWhiteButton,
} from "../../components/Utils";
import {
	desktopConstants,
	mobileConstants,
} from "../../constants/ComponentConstants";
import { useVerifyInstagram } from "../../hooks/authenticationHooks";
import { DeviceContext } from "../../hooks/deviceHooks";
import { Device } from "../../types/types";
import { EventEmitter } from "../../Utils";

const StretchedFlexColumnContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	width: 100%;
`;

interface VerifyInstagramStepsContainerProps {
	device: Device;
}

const VerifyInstagramStepsContainer = styled(StretchedFlexColumnContainer)<VerifyInstagramStepsContainerProps>`
	gap: ${(props) =>
		props.device === "mobile"
			? mobileConstants.mediumSmallGap
			: desktopConstants.mediumSmallerGap};
`;

interface StepProps {
	device: Device;
}

const Step = styled.div<StepProps>`
	display: flex;

	justify-content: flex-start;

	gap: ${(props) =>
		props.device === "mobile"
			? mobileConstants.smallerGap
			: desktopConstants.smallerGap};

	font-size: ${(props) =>
		props.device === "mobile"
			? mobileConstants.regularFontSize
			: desktopConstants.regularFontSize};
`;

interface VerifyInstagramStepsProps {
	device: Device;
	verificationCode: string;
}

function VerifyInstagramSteps({
	device,
	verificationCode,
}: VerifyInstagramStepsProps) {
	return (
		<VerifyInstagramStepsContainer device={device}>
			<Step device={device}>
				<span>
					<span style={{ fontWeight: "bold" }}>1.</span> go to the
					account{" "}
					<span
						style={{ fontWeight: 500 }}
						onClick={() =>
							window.open(
								process.env.REACT_APP_VERIFICATION_INSTAGRAM_URL
							)
						}
					>
						@everything_wall.verify
					</span>
				</span>
			</Step>
			<Step device={device}>
				<span>
					<span style={{ fontWeight: "bold" }}>2.</span> go to the only post in the page
				</span>
			</Step>
			<Step device={device}>
				<span>
					<span style={{ fontWeight: "bold" }}>3.</span> comment your
					verification code:{" "}
					<span style={{ fontWeight: 500 }}>{verificationCode}</span>
				</span>
			</Step>
			<Step device={device}>
				<span>
					<span style={{ fontWeight: "bold" }}>4.</span> click the
					verify comment button below
				</span>
			</Step>
		</VerifyInstagramStepsContainer>
	);
}


interface VerifyInstagramStepsGroupContainerProps {
	device: Device;
}

const VerifyInstagramStepsGroupContainer = styled(StretchedFlexColumnContainer)<VerifyInstagramStepsGroupContainerProps>`
	gap: ${(props) =>
		props.device === "mobile"
			? mobileConstants.mediumGap
			: desktopConstants.mediumGap};
`;

interface VerifyInstagramStepsGroupProps {
	device: Device;
	verificationCode: string;
}

function VerifyInstagramStepsGroup({
	verificationCode,
	device,
}: VerifyInstagramStepsGroupProps) {
	return (
		<VerifyInstagramStepsGroupContainer device={device}>
			<span
				style={{
					fontWeight: "bold",
					fontSize:
						device === "mobile"
							? mobileConstants.regularFontSize
							: desktopConstants.regularFontSize,
				}}
			>
				VERIFICATION STEPS
			</span>
			<VerifyInstagramSteps
				device={device}
				verificationCode={verificationCode}
			/>
		</VerifyInstagramStepsGroupContainer>
	);
}

interface VerifyInstagramNoteProps {
	device: Device;
}

function VerifyInstagramNote({ device }: VerifyInstagramNoteProps) {
	return <span
		style={{
			fontSize:
				device === "mobile"
					? mobileConstants.regularFontSize
					: desktopConstants.regularFontSize,
		}}
	>
		<span style={{ fontWeight: "bold" }}>Note: </span> feel free to delete
		your comment after you are verified
	</span>;
}

interface VerifyInstagramContentContainerProps {
	device: Device;
}

const VerifyInstagramContentContainer = styled(
	StretchedFlexColumnContainer
)<VerifyInstagramContentContainerProps>`
	height: 100%;
    flex-grow: 1;

	gap: ${(props) =>
		props.device === "mobile"
			? mobileConstants.mediumLargeGap
			: desktopConstants.enormousGap};

	justify-content: center;
`;

interface VerifyInstagramContentProps {
	verificationCode: string;
	device: Device;
}

function VerifyInstagramContent({
	verificationCode,
	device,
}: VerifyInstagramContentProps) {
	return (
		<VerifyInstagramContentContainer device={device}>
			<VerifyInstagramStepsGroup
				device={device}
				verificationCode={verificationCode}
			/>
            <VerifyInstagramNote device={device} />
		</VerifyInstagramContentContainer>
	);
}

interface VerifyInstagramContentOuterContainerProps {
    device: Device;
}

const VerifyInstagramContentOuterContainer = styled(
	StretchedFlexColumnContainer
)<VerifyInstagramContentOuterContainerProps>`
	gap: ${(props) =>
		props.device === "mobile"
			? mobileConstants.mediumGap
			: desktopConstants.mediumGap};
    height: 100%;

	padding: ${(props) =>
		props.device === "mobile"
			? mobileConstants.mediumGap
			: desktopConstants.mediumGap};
	box-sizing: border-box;
`;

function VerifyInstagram() {
	const location = useLocation();
	const device = useContext(DeviceContext);
	const navigate = useNavigate();
	const [verifyingInstagram, requestVerifyInstagram] = useVerifyInstagram(
		onVerifySuccess,
		onVerifyFail
	);

	function onVerifySuccess() {
		return navigate("/instagram-sign-up-verified", {
			state: {
				username: getStateData().username,
			},
		});
	}

	function onVerifyFail() {
		return EventEmitter.emit(
			"error",
			"FAILED TO VERIFY. MAKE SURE YOU ONLY ENTER THE 6 DIGITS CODE"
		);
	}

	function onRequestVerify() {
		return requestVerifyInstagram(
			getStateData().username,
			getStateData().verificationCode
		);
	}

	function getStateData(): {
		username: string;
		verificationCode: string;
	} {
		const username = location.state.username;
		const verificationCode = location.state.verificationCode;

		return {
			username,
			verificationCode,
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
				<ResponsiveEmptyAuthenticationCard
					device={device}
					content={
						<VerifyInstagramContentOuterContainer device={device}>
							<VerifyInstagramContent
								verificationCode={
									getStateData().verificationCode
								}
								device={device}
							/>
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
								}}
							>
								<ResponsiveBackgroundColorButton
									text={
										verifyingInstagram
											? "LOADING..."
											: "VERIFY COMMENT"
									}
									device={device}
									onClick={
										verifyingInstagram
											? () => {}
											: onRequestVerify
									}
								/>
							</div>
						</VerifyInstagramContentOuterContainer>
					}
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

export default VerifyInstagram;
