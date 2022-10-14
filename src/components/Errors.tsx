import React, { useState } from "react";
import { EventEmitter } from "../Utils";
import constants from "./constants";
import styled from "styled-components";
import { WhiteButton } from "./Utils";
import { v4 as uuid} from "uuid";

const ErrorsContainer = styled.div`
	position: fixed;
	right: 0;
	left: 0;
	top: 0;
	display: flex;
	flex-direction: column;
	align-items: stretch;
    z-index: 2;
`;

const ErrorContainer = styled.div`
	display: flex;
	align-items: center;
	background-color: rgb(
		${constants.error[0]},
		${constants.error[1]},
		${constants.error[2]}
	);
	padding: ${constants.smallGap};
	padding-left: ${constants.bigGap};
	padding-right: ${constants.bigGap};
	box-sizing: border-box;
	border-bottom: 1px solid black;
`;

interface ErrorObj {
	message: string;
}

interface ErrorProps extends ErrorObj {
    remove: (message: string) => void
}

function Error({ message, remove }: ErrorProps) {
	return (
		<ErrorContainer>
			<span
				style={{
					fontSize: constants.regularFontSize,
					fontWeight: 500,
					display: "inline-flex",
					justifyContent: "flex-start",
					flexGrow: 1,
				}}
			>
				{message}
			</span>
			<WhiteButton onClick={() => {remove(message)}} text="CLOSE" />
		</ErrorContainer>
	);
}

interface ErrorsProps {
	errors: ErrorObj[];
}

function Errors({ errors }: ErrorsProps) {
	const [internalErrors, setInternalErrors] = useState(errors);

	function removeError(message: string) {
		let index: number = internalErrors.findIndex(
			(error) => error.message === message
		);
		setInternalErrors([
			...internalErrors.slice(0, index),
			...internalErrors.slice(index + 1),
		]);
	}

	EventEmitter.on("error", function (message) {
		setInternalErrors([...internalErrors, { message }]);
	});
	return (
		<ErrorsContainer>
			{internalErrors.map((error) => (
				<Error
					message={error.message}
					key={uuid()}
					remove={removeError}
				/>
			))}
		</ErrorsContainer>
	);
}

export default Errors;