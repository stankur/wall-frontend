import React, { useState } from "react";
import styled
 from "styled-components";
import { TwoSidedCard, BackgroundColorButton } from "./Utils";
import {desktopConstants} from "../constants/ComponentConstants";

const QuoteOuterContainer = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
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
	flex-basis: 0;
	flex-grow: 1;
`;
const InputsInnerContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: ${desktopConstants.bigGap};
`;

interface InputsProps {
	username: string;
	password: string;
	usernameDescription?: string;
	passwordDescription?: string;
	changeUsername: (newUsername: string) => void;
	changePassword: (newPassword: string) => void;
}
function Inputs({
	username,
	password,
	usernameDescription = undefined,
	passwordDescription = undefined,
	changeUsername,
	changePassword,
}: InputsProps) {
	return (
		<InputsOuterContainer>
			<InputsInnerContainer>
				<LabeledInput
					name="USERNAME"
					value={username}
					description={usernameDescription}
					onChange={(e) => {
						return changeUsername(e.currentTarget.value);
					}}
				/>
				<LabeledInput
					name="PASSWORD"
					type="password"
					value={password}
					description={passwordDescription}
					onChange={(e) => {
						return changePassword(e.currentTarget.value);
					}}
				/>
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
	onClick: React.MouseEventHandler;
	buttonText: string;
}

function InputsGroup({
	onClick,
	buttonText,
	username,
	password,
	usernameDescription = undefined,
	passwordDescription = undefined,
	changeUsername,
	changePassword,
}: InputsGroupProps) {
	return (
		<InputsGroupOuterContainer>
			<Inputs
				username={username}
				usernameDescription={usernameDescription}
				passwordDescription={passwordDescription}
				password={password}
				changeUsername={changeUsername}
				changePassword={changePassword}
			/>
			<span style={{ alignSelf: "flex-end" }}>
				<BackgroundColorButton onClick={onClick} text={buttonText} />
			</span>
		</InputsGroupOuterContainer>
	);
}

interface AuthenticationCardProps {
	submitUsernamePassword: (username: string, password: string) => void;
	buttonText: string;
	usernameDescription?: string;
	passwordDescription?: string;
}
function useUsernamePassword(): [
	string,
	string,
	(newUsername: string) => void,
	(newPassword: string) => void
] {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const almostAcceptableUsername = /^([a-z]|[A-Z]|[0-9])*$/;

	function changeUsername(newUsername: string) {
		if (almostAcceptableUsername.test(newUsername)) {
			return setUsername(newUsername.toUpperCase());
		}
	}

	function changePassword(newPassword: string) {
		return setPassword(newPassword);
	}

	return [username, password, changeUsername, changePassword];
}
function AuthenticationCard({
	submitUsernamePassword,
	buttonText,
	passwordDescription = undefined,
	usernameDescription = undefined,
}: AuthenticationCardProps) {
	const [username, password, changeUsername, changePassword] =
		useUsernamePassword();
	return (
		<TwoSidedCard
			left={<Quote />}
			right={
				<InputsGroup
					onClick={() => submitUsernamePassword(username, password)}
					buttonText={buttonText}
					username={username}
					passwordDescription={passwordDescription}
					usernameDescription={usernameDescription}
					password={password}
					changePassword={changePassword}
					changeUsername={changeUsername}
				/>
			}
			leftProportion={2}
			rightProportion={5}
		/>
	);
}


export default AuthenticationCard;