import styled from "styled-components";
import { makeNumDigits } from "./helper";
import {
	desktopConstants,
	mobileConstants,
} from "../constants/ComponentConstants";
import { Link } from "react-router-dom";

import { GradientContainer, LogoContainer, MobileLogoContainer } from "./Utils";
import { Countdown, MobileCountdown } from "./Countdown";

import { AppState, Device } from "../types/types";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { ReactNode } from "react";
dayjs.extend(duration);

const IgLogo = styled.img`
	display: inline;
`;

const RoundContainer = styled.div`
	display: flex;
	gap: ${desktopConstants.bigGap};
	font-size: ${desktopConstants.mediumFontSize};
	font-weight: bold;
`;

interface RoundProps {
	number: number;
}

function RoundContent({ number }: RoundProps) {
	return (
		<>
			<span>ROUND</span>
			<span>#{makeNumDigits(3, number)}</span>
		</>
	);
}
function Round({ number }: RoundProps) {
	return (
		<RoundContainer>
			<RoundContent number={number} />
		</RoundContainer>
	);
}


interface HeroProps {
	roundData: AppState;
    children?: ReactNode;
}

const SloganContainer = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 5px;
	font-size: ${desktopConstants.regularLargerSize};
	cursor: pointer;
`;

const HeroContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${desktopConstants.EnormousGap};
	align-items: center;

	padding-top: ${desktopConstants.humongousGap};
	padding-bottom: ${desktopConstants.bigGap};

	box-sizing: border-box;
`;

const HeroCardContainer = styled.div`
	width: ${desktopConstants.mainContentWidth};
	border-radius: ${desktopConstants.radius};
	border: 1px solid black;

    display: flex;

	background-color: rgb(
		${desktopConstants.backgroundLite[0]},
		${desktopConstants.backgroundLite[1]},
		${desktopConstants.backgroundLite[2]}
	);

	padding: ${desktopConstants.EnormousGap};
    gap: ${desktopConstants.EnormousGap};

    box-sizing: border-box;
`;

const DescriptionCardContainer = styled.div`
	flex-grow: 1;
	flex-basis: 0;

	border-radius: ${desktopConstants.radius};
	border: 1px solid black;

	display: flex;
	flex-direction: column;

	box-shadow: 1px 1px 9px rgba(0, 0, 0, 0.25);
`;

const DescriptionCardTextSectionContainer = styled.div`
	padding: ${desktopConstants.biggerGap};
	padding-top: ${desktopConstants.EnormousGap};

	box-sizing: border-box;

	border-top-left-radius: ${desktopConstants.radius};
	border-top-right-radius: ${desktopConstants.radius};

	background-color: white;
	line-height: ${desktopConstants.descriptionCardGap};
	text-align: center;
	font-size: ${desktopConstants.regularLargerSize};
`;

const DescriptionCardIgSectionContainer = styled(GradientContainer)`
	padding: ${desktopConstants.mediumGap};
	box-sizing: border-box;

	border-bottom-left-radius: ${desktopConstants.radius};
    border-bottom-right-radius: ${desktopConstants.radius};

	width: 100%;

	display: flex;
	justify-content: center;
	align-items: center;
    gap: 5px;

	border-top: 1px solid black;
`;

const HeroCardLeftContainer = styled.div`
    flex-basis: 0;
    flex-grow: 1;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;
    gap: ${desktopConstants.mediumGap};
`

function Hero({ roundData, children }: HeroProps) {
	return (
		<HeroContainer>
			<HeroCardContainer>
				<HeroCardLeftContainer>
					<Link
						to="/"
						style={{ textDecoration: "none", color: "black" }}
					>
						<LogoContainer>WALL</LogoContainer>
					</Link>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: desktopConstants.smallGap,
						}}
					>
						<Round number={roundData.currentRound} />
						<Countdown finishTime={roundData.currentRoundFinish} />
					</div>
				</HeroCardLeftContainer>
				<DescriptionCardContainer>
					<DescriptionCardTextSectionContainer>
						AT THE END OF EACH ROUND, THE IMAGE WITH MOST POINTS AND
						ITS TOP CAPTION GETS POSTED TO THE INSTAGRAM PAGE OF THE
						PEOPLE:
					</DescriptionCardTextSectionContainer>
					<DescriptionCardIgSectionContainer>
						<SloganContainer
							onClick={() => {
								window.open(
									process.env.REACT_APP_INSTAGRAM_URL
								);
							}}
						>
							<IgLogo width="21px" src="/ig.png" />
							<span>@everything_wall</span>
						</SloganContainer>
					</DescriptionCardIgSectionContainer>
				</DescriptionCardContainer>
			</HeroCardContainer>
			{children}
		</HeroContainer>
	);
}

const LogoHeroContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100vw;

	padding-bottom: ${desktopConstants.humongousGap};
	box-sizing: border-box;
`;

const LogoHeroIgSectionContainer = styled(GradientContainer)`
	width: 100vw;
	border-top: 1px solid black;
	border-bottom: 1px solid black;
	display: flex;
	justify-content: center;
	padding: ${desktopConstants.mediumGap};
    box-sizing: border-box;
`;


function LogoHeroIgSection() {
	return (
		<LogoHeroIgSectionContainer>
			<SloganContainer
				onClick={() => {
					window.open(process.env.REACT_APP_INSTAGRAM_URL);
				}}
			>
				<IgLogo width="21px" src="/ig.png" />
				<span>@everything_wall</span>
			</SloganContainer>
		</LogoHeroIgSectionContainer>
	);
}
const LogoHeroLogoSectionContainer = styled.div`
	display: flex;
	justify-content: center;

	width: 100vw;
	padding: ${desktopConstants.bigGap};
	box-sizing: border-box;

	background-color: rgb(
		${desktopConstants.backgroundLite[0]},
		${desktopConstants.backgroundLite[1]},
		${desktopConstants.backgroundLite[2]}
	);
`;

function LogoHeroLogoSection() {
	return (
		<LogoHeroLogoSectionContainer>
			<Link to="/" style={{ textDecoration: "none", color: "black" }}>
				<LogoContainer>WALL</LogoContainer>
			</Link>
		</LogoHeroLogoSectionContainer>
	);
}

function LogoHero() {
	return (
		<LogoHeroContainer>
            <LogoHeroLogoSection/>
			<LogoHeroIgSection />
		</LogoHeroContainer>
	);
}

//////////////////////////////////////////////////////////// MOBILE COMPONENTS ////////////////////////////////////////////////////////////

const MobileRoundContainer = styled(RoundContainer)`
	gap: ${mobileConstants.mediumGap};
	font-size: ${mobileConstants.mediumFontSize};
`;

function MobileRound({ number }: RoundProps) {
	return (
		<MobileRoundContainer>
			<RoundContent number={number} />
		</MobileRoundContainer>
	);
}


const MobileHeroContainer = styled(HeroContainer)`
	gap: ${mobileConstants.mediumGap};

	padding-top: ${mobileConstants.mediumLargeGap};
	padding-bottom: ${mobileConstants.smallGap};
`;

const MobileHeroCardContainer = styled(HeroCardContainer)`
	flex-direction: column;
	flex-grow: 0;
	flex-basis: auto;
	align-items: center;

	width: ${mobileConstants.mainContentWidth};
	border-radius: ${mobileConstants.outerRadius};

	padding: ${mobileConstants.mediumLargeGap};
	gap: ${mobileConstants.mediumLargerGap};
`;

const MobileDescriptionCardContainer = styled(DescriptionCardContainer)`
	flex-grow: 0;
	flex-basis: auto;

	border-radius: ${mobileConstants.outerRadius};
`;

const MobileDescriptionCardTextSectionContainer = styled(
	DescriptionCardTextSectionContainer
)`
	padding: ${mobileConstants.mediumGap};

	border-top-left-radius: ${mobileConstants.outerRadius};
	border-top-right-radius: ${mobileConstants.outerRadius};

	line-height: ${mobileConstants.descriptionCardGap};

	font-size: ${mobileConstants.regularFontSize};
`;

const MobileDescriptionCardIgSectionContainer = styled(
	DescriptionCardIgSectionContainer
)`
	padding: ${mobileConstants.mediumGap};
	border-bottom-left-radius: ${mobileConstants.outerRadius};
	border-bottom-right-radius: ${mobileConstants.outerRadius};
`;

const MobileHeroCardLogoSectionContainer = styled(HeroCardLeftContainer)`
	flex-basis: auto;
	flex-grow: 0;

    width: 100%;

	gap: ${mobileConstants.smallerGap};
`;

function MobileHero({ roundData, children }: HeroProps) {
	return (
		<MobileHeroContainer>
			<MobileHeroCardContainer>
				<MobileHeroCardLogoSectionContainer>
					<Link
						to="/"
						style={{ textDecoration: "none", color: "black" }}
					>
						<MobileLogoContainer>WALL</MobileLogoContainer>
					</Link>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: mobileConstants.mediumSmallerGap,
						}}
					>
						<MobileRound number={roundData.currentRound} />
						<MobileCountdown
							finishTime={roundData.currentRoundFinish}
						/>
					</div>
				</MobileHeroCardLogoSectionContainer>
				<MobileDescriptionCardContainer>
					<MobileDescriptionCardTextSectionContainer>
						AT THE END OF EACH ROUND, THE IMAGE WITH MOST POINTS AND
						ITS TOP CAPTION GETS POSTED TO THE INSTAGRAM PAGE OF THE
						PEOPLE:
					</MobileDescriptionCardTextSectionContainer>
					<MobileDescriptionCardIgSectionContainer>
						<MobileSloganContainer
							onClick={() => {
								window.open(
									process.env.REACT_APP_INSTAGRAM_URL
								);
							}}
						>
							<IgLogo width="16px" src="/ig.png" />
							<span>@everything_wall</span>
						</MobileSloganContainer>
					</MobileDescriptionCardIgSectionContainer>
				</MobileDescriptionCardContainer>
			</MobileHeroCardContainer>
			{children}
		</MobileHeroContainer>
	);
}
const MobileLogoHeroContainer = styled(LogoHeroContainer)`
	padding-bottom: ${mobileConstants.bigGap};
`;

const MobileSloganContainer = styled(SloganContainer)`
	font-size: ${mobileConstants.regularLargerFontSize};
`;

const MobileLogoHeroIgSectionContainer = styled(LogoHeroIgSectionContainer)`
	padding: ${mobileConstants.mediumGap};
`;

function MobileLogoHeroIgSection() {
    return (
		<MobileLogoHeroIgSectionContainer>
			<MobileSloganContainer
				onClick={() => {
					window.open(process.env.REACT_APP_INSTAGRAM_URL);
				}}
			>
				<IgLogo width="16px" src="/ig.png" />
				<span>@everything_wall</span>
			</MobileSloganContainer>
		</MobileLogoHeroIgSectionContainer>
	);
}

const MobileLogoHeroLogoSectionContainer = styled(LogoHeroLogoSectionContainer)`
	padding: ${mobileConstants.mediumGap};
`; 

function MobileLogoHeroLogoSection() {
	return (
		<MobileLogoHeroLogoSectionContainer>
			<Link to="/" style={{ textDecoration: "none", color: "black" }}>
				<MobileLogoContainer>WALL</MobileLogoContainer>
			</Link>
		</MobileLogoHeroLogoSectionContainer>
	);
}

function MobileLogoHero() {
	return (
		<MobileLogoHeroContainer>
			<MobileLogoHeroLogoSection />
			<MobileLogoHeroIgSection />
		</MobileLogoHeroContainer>
	);
}

//////////////////////////////////////////////////////////// RESPONSIVE COMPONENTS ////////////////////////////////////////////////////////////

interface ResponsivePlainLogoHeroProps {
	device: Device;
}
function ResponsivePlainLogoHero({ device }: ResponsivePlainLogoHeroProps) {
	if (device === "mobile") {
		return <MobileLogoHero />;
	}

	return <LogoHero />;
}

interface ResponsiveHeroProps extends HeroProps {
	device: Device;
}

function ResponsiveHero({ device, roundData, children }: ResponsiveHeroProps) {
	if (device === "mobile") {
		return <MobileHero roundData={roundData}>{children}</MobileHero>;
	}

	return <Hero roundData={roundData}>{children}</Hero>;
};

export { ResponsiveHero, ResponsivePlainLogoHero };
