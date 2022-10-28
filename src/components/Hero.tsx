import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { makeNumDigits } from "./helper";
import constants from "../constants/ComponentConstants";
import { Link } from "react-router-dom";
import { LogoContainer } from "./Utils";

const SloganContainer = styled.span`
	display: inline-flex;
    align-items: center;
    gap: 5px;
	font-size: ${constants.regularLargerSize};
	font-weight: 500;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -200%);
	z-index: 1;
`;

const IgLogo = styled.img`
    display: inline;
`

function Logo() {
	return (
		<Link to="/" style={{ textDecoration: "none", color: "black" }}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: constants.smallGap,
				}}
			>
				<LogoContainer>WALL</LogoContainer>
				<span style={{ position: "relative" }}>
					<SloganContainer
						onClick={() => {
							window.open(
								"https://www.instagram.com/everything_wall/"
							);
						}}
					>
						<IgLogo width="15px" src="./ig.png" />
						<span>everything_wall</span>
					</SloganContainer>
				</span>
			</div>
		</Link>
	);
}

const RoundContainer = styled.div`
	display: flex;
	gap: ${constants.bigGap};
	font-size: ${constants.mediumFontSize};
	font-weight: bold;
`;

interface RoundProps {
	number: number;
}
function Round({ number }: RoundProps) {
	return (
		<RoundContainer>
			<span>ROUND</span>
			<span>#{makeNumDigits(3, number)}</span>
		</RoundContainer>
	);
}

interface TimeTimeUnitProps {
	time: number;
	unit: string;
}

function TimeTimeUnit({ time, unit }: TimeTimeUnitProps) {
	return (
		<div
			style={{
				display: "inline-flex",
				gap: constants.smallerGap,
				alignItems: "baseline",
			}}
		>
			<span
				style={{
					fontSize: constants.mediumSmallFontSize,
					fontWeight: "bold",
				}}
			>
				{makeNumDigits(2, time)}
			</span>
			<span
				style={{
					fontSize: constants.mediumSmallerFontSize,
					fontWeight: 500,
				}}
			>
				{unit}
			</span>
		</div>
	);
}

const CountdownContainer = styled.div`
	padding: ${constants.smallGap};
	border: 1px solid black;
	border-radius: ${constants.radius};
	display: inline-flex;
	gap: ${constants.EnormousGap};
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
            return
        }

        setInternalHours(internalHours - 1);
    }

    function decrementMinute() {
        if (internalMinutes === 0) {
            setInternalMinutes(maxMinutes);
            decrementHour()
            return
        }

        setInternalMinutes(internalMinutes - 1);
    }

    function decrementSecond() {
        if (internalSeconds === 0) { 
            setInternalSeconds(maxSeconds);
            decrementMinute();
            return
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
	gap: ${constants.smallGap};
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
		<HeroContainer style={{paddingBottom: "70px"}}>
			<Logo />
		</HeroContainer>
	);
}

export default Hero;
export { LogoHero };
