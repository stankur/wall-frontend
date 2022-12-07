import { useState, useEffect } from "react";

import { makeNumDigits } from "./helper";
import {
	desktopConstants,
	mobileConstants,
} from "../constants/ComponentConstants";

import dayjs from "dayjs";
import styled from "styled-components";

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

    box-shadow: 1px 1px 9px rgba(0,0,0,0.25);
`;

interface CountdownTime {
	hours: number;
	minutes: number;
	seconds: number;
}

function useCountdown({ hours, minutes, seconds }: CountdownTime) {
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

interface CountdownProps {
	finishTime: string;
}

function getCountdownTime(finishTime: string): CountdownTime {
	let now = dayjs().valueOf();
	let milisecondsFromNow = dayjs(finishTime).diff(now);
	let duration = dayjs.duration(milisecondsFromNow);

	if (milisecondsFromNow <= 0) {
		return {
			hours: 0,
			minutes: 0,
			seconds: 0,
		};
	}

	let hoursPortionOfTimeFromNow = duration.hours();
	let minsPortionOfTimeFromNow = duration.minutes();
	let secsPortionOfTimeFromNow = duration.seconds();

	return {
		hours: hoursPortionOfTimeFromNow,
		minutes: minsPortionOfTimeFromNow,
		seconds: secsPortionOfTimeFromNow,
	};
}

function useCountdownTime({ finishTime }: CountdownProps): CountdownTime {
	return getCountdownTime(finishTime);
}

function Countdown({ finishTime }: CountdownProps) {
	const countdownTime = useCountdownTime({ finishTime });
	const [internalHours, internalMinutes, internalSeconds] =
		useCountdown(countdownTime);

	return (
		<CountdownContainer>
			<TimeTimeUnit time={internalHours} unit="H" />
			<TimeTimeUnit time={internalMinutes} unit="M" />
			<TimeTimeUnit time={internalSeconds} unit="S" />
		</CountdownContainer>
	);
}

//////////////////////////////////////////////////////////// MOBILE COMPONENTS ////////////////////////////////////////////////////////////

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

function MobileCountdown({ finishTime }: CountdownProps) {
	const countdownTime = useCountdownTime({ finishTime });
	const [internalHours, internalMinutes, internalSeconds] =
		useCountdown(countdownTime);

	return (
		<MobileCountdownContainer>
			<MobileTimeTimeUnit time={internalHours} unit="H" />
			<MobileTimeTimeUnit time={internalMinutes} unit="M" />
			<MobileTimeTimeUnit time={internalSeconds} unit="S" />
		</MobileCountdownContainer>
	);
}


export { Countdown };

export {MobileCountdown}