import React, { useState } from "react";
import styled
 from "styled-components";
import { TwoSidedCard, BackgroundColorButton, MobileBackgroundColorButton, MobileTwoSidedCard } from "./Utils";
import {desktopConstants, mobileConstants} from "../constants/ComponentConstants";
import { Device } from "../types/types";

import { v4 as uuid } from "uuid";

const QuoteOuterContainer = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
    align-items: center;
	padding: ${desktopConstants.humongousGap};
`;
const QuoteInnerContainer = styled.div`
	font-size: ${desktopConstants.mediumFontSize};
	font-weight: bold;
`;
function Quote() {
	return (
		<QuoteOuterContainer>
			<QuoteInnerContainer>
				LOVE IS TEMPORARY, SHREK IS ETERNAL
			</QuoteInnerContainer>
		</QuoteOuterContainer>
	);
}

const LabeledInputContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: flex-start;
	gap: ${desktopConstants.smallerGap};
`;

const BackgroundColorInput = styled.input`
	background-color: rgb(
		${desktopConstants.background[0]},
		${desktopConstants.background[1]},
		${desktopConstants.background[2]}
	);
	border: 1px solid black;
	border-radius: ${desktopConstants.radius};
	box-sizing: border-box;
	width: 100%;
	outline: none;
	height: 1.8em;
`;

interface LabeledInputProps {
	name: string;
    description?: string;
	type?: React.HTMLInputTypeAttribute;
	value: string;
	onChange: (event: React.FormEvent<HTMLInputElement>) => void;
}
function LabeledInput({
	name,
	value,
	description = undefined,
	type = "text",
	onChange,
}: LabeledInputProps) {
	return (
		<LabeledInputContainer>
			<span
				style={{
					fontSize: desktopConstants.regularFontSize,
					fontWeight: "bold",
				}}
			>
				{name}
			</span>
			{!!description && (
				<span
					style={{
						fontSize: desktopConstants.regularFontSize,
					}}
				>
					{description}
				</span>
			)}
			<BackgroundColorInput
				type={type}
				value={value}
				onChange={onChange}
			/>
		</LabeledInputContainer>
	);
}
const InputsOuterContainer = styled.div`
	display: flex;
	align-items: center;
	box-sizing: border-box;
	flex-grow: 1;
	padding-bottom: ${desktopConstants.mediumGap};
	padding-top: ${desktopConstants.mediumGap};
`;
const InputsInnerContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: ${desktopConstants.bigGap};
`;

interface InputsProps {
	labeledInputData: LabeledInputProps[];
}
function Inputs({ labeledInputData }: InputsProps) {
	return (
		<InputsOuterContainer>
			<InputsInnerContainer>
				{labeledInputData.map(function (labeledInputDatum) {
					return (
						<LabeledInput
							name={labeledInputDatum.name}
							value={labeledInputDatum.value}
							description={labeledInputDatum.description}
							onChange={labeledInputDatum.onChange}
							type={labeledInputDatum.type}
							key={labeledInputDatum.name}
						/>
					);
				})}
			</InputsInnerContainer>
		</InputsOuterContainer>
	);
}

const InputsGroupOuterContainer = styled.div`
	width: 100%;
	height: 100%;
	padding: ${desktopConstants.mediumGap};
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
`;

interface InputsGroupProps extends InputsProps {
	onSubmitClick: React.MouseEventHandler;
	buttonText: string;
}

function InputsGroup({
	onSubmitClick,
	buttonText,
	labeledInputData,
}: InputsGroupProps) {
	return (
		<InputsGroupOuterContainer>
			<Inputs labeledInputData={labeledInputData} />
			<span style={{ alignSelf: "flex-end" }}>
				<BackgroundColorButton
					onClick={onSubmitClick}
					text={buttonText}
				/>
			</span>
		</InputsGroupOuterContainer>
	);
}

interface AuthenticationCardProps extends InputsGroupProps {
}

function AuthenticationCard({
	onSubmitClick,
	buttonText,
	labeledInputData,
}: AuthenticationCardProps) {
	return (
		<TwoSidedCard
			left={<Quote />}
			right={
				<InputsGroup
					onSubmitClick={onSubmitClick}
					buttonText={buttonText}
					labeledInputData={labeledInputData}
				/>
			}
			leftProportion={2}
			rightProportion={5}
		/>
	);
}

//////////////////////////////////////////////////////////// MOBILE COMPONENTS ////////////////////////////////////////////////////////////

const MobileQuoteOuterContainer = styled.div`
	padding: ${mobileConstants.mediumLargeGap};
	padding-left: ${mobileConstants.mediumLargerGap};
	padding-right: ${mobileConstants.mediumLargerGap};
	box-sizing: border-box;
	width: 100%;
	display: flex;
	justify-content: center;
`;

const MobileQuoteInnerContainer = styled(QuoteInnerContainer)`
	font-size: ${mobileConstants.mediumFontSize};
	text-align: center;
`;

function MobileQuote() {
	return (<MobileQuoteOuterContainer>
		<MobileQuoteInnerContainer>
			LOVE IS TEMPORARY, SHREK IS ETERNAL
		</MobileQuoteInnerContainer>
	</MobileQuoteOuterContainer>);
}

const MobileLabeledInputContainer = styled(LabeledInputContainer)`
    gap: ${mobileConstants.smallerGap};
`

const MobileBackgroundColorInput = styled(BackgroundColorInput)`
	border-radius: ${mobileConstants.innerRadius};
`;

function MobileLabeledInput({
	name,
	value,
	description = undefined,
	type = "text",
	onChange,
}: LabeledInputProps) {
	return (
		<MobileLabeledInputContainer>
			<span
				style={{
					fontSize: desktopConstants.regularFontSize,
					fontWeight: "bold",
				}}
			>
				{name}
			</span>
			{!!description && (
				<span
					style={{
						fontSize: desktopConstants.regularFontSize,
					}}
				>
					{description}
				</span>
			)}
			<MobileBackgroundColorInput
				type={type}
				value={value}
				onChange={onChange}
			/>
		</MobileLabeledInputContainer>
	);
}

const MobileInputsOuterContainer = styled.div`
	display: flex;
	align-items: center;
	width: 100%;

    padding: 0px;
`;

const MobileInputsInnerContainer = styled(InputsInnerContainer)`
	gap: ${mobileConstants.mediumGap};
`;

function MobileInputs({ labeledInputData }: InputsProps) {
	return (
		<MobileInputsOuterContainer>
			<MobileInputsInnerContainer>
				{labeledInputData.map(function (labeledInputDatum) {
					return (
						<MobileLabeledInput
							name={labeledInputDatum.name}
							value={labeledInputDatum.value}
							description={labeledInputDatum.description}
							onChange={labeledInputDatum.onChange}
							type={labeledInputDatum.type}
							key={labeledInputDatum.name}
						/>
					);
				})}
			</MobileInputsInnerContainer>
		</MobileInputsOuterContainer>
	);
}

const MobileInputsGroupOuterContainer = styled(InputsGroupOuterContainer)`
	padding: ${mobileConstants.mediumGap};
	gap: ${mobileConstants.mediumLargeGap};
`;

function MobileInputsGroup({
	onSubmitClick,
	buttonText,
	labeledInputData,
}: InputsGroupProps) {
	return (
		<MobileInputsGroupOuterContainer>
			<MobileInputs labeledInputData={labeledInputData} />
			<span style={{ alignSelf: "flex-end" }}>
				<MobileBackgroundColorButton
					onClick={onSubmitClick}
					text={buttonText}
				/>
			</span>
		</MobileInputsGroupOuterContainer>
	);
}

function MobileAuthenticationCard({
	onSubmitClick,
	buttonText,
	labeledInputData
}: AuthenticationCardProps) {
	return (
		<MobileTwoSidedCard
			top={<MobileQuote />}
			bottom={
				<MobileInputsGroup
					onSubmitClick={onSubmitClick}
					buttonText={buttonText}
                    labeledInputData={labeledInputData}
				/>
			}
		/>
	);
}

//////////////////////////////////////////////////////////// RESPONSIVE COMPONENTS ////////////////////////////////////////////////////////////

interface ResponsiveAuthenticationCardProps extends AuthenticationCardProps {
	device: Device;
}

function ResponsiveAuthenticationCard({
	device,
	buttonText,
	onSubmitClick,
    labeledInputData
}: ResponsiveAuthenticationCardProps) {
	if (device === "mobile") {
		return (
			<MobileAuthenticationCard
				labeledInputData={labeledInputData}
				buttonText={buttonText}
                onSubmitClick={onSubmitClick}
			/>
		);
	}

	return (
		<AuthenticationCard
			labeledInputData={labeledInputData}
			buttonText={buttonText}
			onSubmitClick={onSubmitClick}
		/>
	);
}

export { ResponsiveAuthenticationCard };