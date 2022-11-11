import React, { ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import { makeNumDigits } from "./helper";
import {
	desktopConstants,
	mobileConstants,
} from "../constants/ComponentConstants";
import { Link } from "react-router-dom";
import { LogoContainer, MobileLogoContainer } from "./Utils";
import { Device } from "../types/types";

const SloganContainer = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 5px;
	font-size: ${desktopConstants.regularLargerSize};
	font-weight: 500;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -200%);
	z-index: 1;
`;

const IgLogo = styled.img`
	display: inline;
`;

function Logo() {
	return (
		<Link to="/" style={{ textDecoration: "none", color: "black" }}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: desktopConstants.smallGap,
				}}
			>
				<LogoContainer>WALL</LogoContainer>
				<span style={{ position: "relative" }}>
					<SloganContainer
						onClick={() => {
							console.log(
								"ig url: " + process.env.REACT_APP_INSTAGRAM_URL
							);
							window.open(process.env.REACT_APP_INSTAGRAM_URL);
						}}
					>
						<IgLogo width="15px" src="/ig.png" />
						<span>everything_wall</span>
					</SloganContainer>
				</span>
			</div>
		</Link>
	);
}

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

const TimeTimeUnitContainer = styled.div`
	display: inline-flex;
	gap: ${desktopConstants.smallerGap};
	align-items: baseline;
`;

interface TimeTimeUnitProps {
	time: number;
	unit: string;
}

function TimeTimeUnit({ time, unit }: TimeTimeUnitProps) {
	return (
		<TimeTimeUnitContainer>
			<span
				style={{
					fontSize: desktopConstants.mediumSmallFontSize,
					fontWeight: "bold",
				}}
			>
				{makeNumDigits(2, time)}
			</span>
			<span
				style={{
					fontSize: desktopConstants.mediumSmallerFontSize,
					fontWeight: 500,
				}}
			>
				{unit}
			</span>
		</TimeTimeUnitContainer>
	);
}

const CountdownContainer = styled.div`
	padding: ${desktopConstants.smallGap};
	border: 1px solid black;
	border-radius: ${desktopConstants.radius};
	display: inline-flex;
	gap: ${desktopConstants.EnormousGap};
	background-color: white;
`;

interface CountdownProps {
	hours: number;
	minutes: number;
	seconds: number;
}

function useCountdown({ hours, minutes, seconds }: CountdownProps) {
	const [internalHours, setInternalHours] = useState(hours);
	const [internalMinutes, setInternalMinutes] = useState(minutes);
	const [internalSeconds, setInternalSeconds] = useState(seconds);

	const maxMinutes: number = 59;
	const maxSeconds: number = 59;

	function decrementHour() {
		if (internalHours === 0) {
			setInternalHours(hours);
			setInternalMinutes(minutes);
			setInternalSeconds(seconds);
			return;
		}

		setInternalHours(internalHours - 1);
	}

	function decrementMinute() {
		if (internalMinutes === 0) {
			setInternalMinutes(maxMinutes);
			decrementHour();
			return;
		}

		setInternalMinutes(internalMinutes - 1);
	}

	function decrementSecond() {
		if (internalSeconds === 0) {
			setInternalSeconds(maxSeconds);
			decrementMinute();
			return;
		}

		setInternalSeconds(internalSeconds - 1);
	}

	useEffect(function () {
		setTimeout(() => decrementSecond(), 1000);
	});

	return [internalHours, internalMinutes, internalSeconds];
}

function Countdown({ hours, minutes, seconds }: CountdownProps) {
	const [internalHours, internalMinutes, internalSeconds] = useCountdown({
		hours,
		minutes,
		seconds,
	});

	return (
		<CountdownContainer>
			<TimeTimeUnit time={internalHours} unit="H" />
			<TimeTimeUnit time={internalMinutes} unit="M" />
			<TimeTimeUnit time={internalSeconds} unit="S" />
		</CountdownContainer>
	);
}

const HeroContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 100px;
	padding-bottom: 50px;
	box-sizing: border-box;
	gap: ${desktopConstants.smallGap};
`;

function Hero() {
	return (
		<HeroContainer>
			<Logo />
			<Round number={3} />
			<Countdown hours={1} minutes={20} seconds={30} />
		</HeroContainer>
	);
}

function LogoHero() {
	return (
		<HeroContainer style={{ paddingBottom: "70px" }}>
			<Logo />
		</HeroContainer>
	);
}

//////////////////////////////////////////////////////////// MOBILE COMPONENTS ////////////////////////////////////////////////////////////

const MobileHeaderContainer = styled.div`
	width: 100%;
	display: flex;
	align-items: flex-start;
	padding: ${mobileConstants.mediumSmallerGap};
	box-sizing: border-box;
	justify-content: space-between;
`;

const IgContainer = styled.div`
	display: inline-flex;
	gap: ${mobileConstants.smallGap};
	align-items: center;
	font-size: ${mobileConstants.regularFontSize};
	font-weight: 500;
`;

function MobileIg() {
	return (
		<IgContainer
			onClick={() => {
				console.log(
					"insta url: " + process.env.REACT_APP_INSTAGRAM_URL
				);
				window.open(process.env.REACT_APP_INSTAGRAM_URL);
			}}
		>
			<IgLogo width="18px" src="/ig.png" />
			<span
				style={{
					fontWeight: 500,
					fontSize: mobileConstants.regularLargerFontSize,
				}}
			>
				everything_wall
			</span>
		</IgContainer>
	);
}

interface MobileHeaderProps {
	navigation?: ReactElement | undefined;
}

function MobileHeader({ navigation = undefined }: MobileHeaderProps) {
	return (
		<MobileHeaderContainer>
			<MobileIg />
			{!!navigation ? (
				<div style={{ display: "inline-block", position: "relative" }}>
					<div style={{ position: "absolute", right: 0, top: 0 }}>
						{navigation}
					</div>
				</div>
			) : (
				<span style={{ flexGrow: 1 }} />
			)}
		</MobileHeaderContainer>
	);
}

function MobileLogo() {
	return (
		<MobileLogoContainer>
			<Link to="/" style={{ textDecoration: "none", color: "black" }}>
			WALL
			</Link>
            </MobileLogoContainer>
	);
}

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

const MobileTimeTimeUnitContainer = styled(TimeTimeUnitContainer)`
	gap: ${mobileConstants.smallerGap};
`;

function MobileTimeTimeUnit({ time, unit }: TimeTimeUnitProps) {
	return (
		<MobileTimeTimeUnitContainer>
			<span
				style={{
					fontSize: mobileConstants.mediumSmallFontSize,
					fontWeight: "bold",
				}}
			>
				{makeNumDigits(2, time)}
			</span>
			<span
				style={{
					fontSize: mobileConstants.mediumSmallerFontSize,
					fontWeight: 500,
				}}
			>
				{unit}
			</span>
		</MobileTimeTimeUnitContainer>
	);
}

const MobileCountdownContainer = styled(CountdownContainer)`
	padding: ${mobileConstants.smallGap};
	border-radius: ${mobileConstants.outerRadius};
	gap: ${mobileConstants.mediumGap};
`;

function MobileCountdown({ hours, minutes, seconds }: CountdownProps) {
	const [internalHours, internalMinutes, internalSeconds] = useCountdown({
		hours,
		minutes,
		seconds,
	});
	return (
		<MobileCountdownContainer>
			<MobileTimeTimeUnit time={internalHours} unit="H" />
			<MobileTimeTimeUnit time={internalMinutes} unit="M" />
			<MobileTimeTimeUnit time={internalSeconds} unit="S" />
		</MobileCountdownContainer>
	);
}



const MobileHeroContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${mobileConstants.smallGap};
	padding-bottom: ${mobileConstants.bigSmallGap};
`;

interface MobileHeroProps extends MobileHeaderProps {}

function MobileHero({ navigation = undefined }: MobileHeroProps) {
	return (
		<MobileHeroContainer>
			<MobileHeader navigation={navigation} />
			<MobileLogo />
			<MobileRound number={3} />
			<MobileCountdown hours={1} minutes={20} seconds={30} />
		</MobileHeroContainer>
	);
}

function MobileLogoHero({ navigation = undefined }: MobileHeroProps) {
	return (
		<MobileHeroContainer>
			<MobileHeader navigation={navigation} />
			<MobileLogo />
		</MobileHeroContainer>
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

export { Hero, MobileHero, ResponsivePlainLogoHero };
