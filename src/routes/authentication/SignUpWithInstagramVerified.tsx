import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { ResponsiveAuthenticationCard } from "../../components/AuthenticationCard";
import { DeviceContext } from "../../hooks/deviceHooks";

function SignUpWithInstagramVerified() {
	const location = useLocation();
	const device = useContext(DeviceContext);

	const [password, setPassword] = useState("");

	return (
		<ResponsiveAuthenticationCard
			device={device}
			buttonText="JOIN WALL"
			onSubmitClick={() => {}}
			labeledInputData={[
				{
					name: "PASSWORD",
					description: "AT LEAST 10 CHARACTERS",
					value: password,
					type: "password",
					onChange: (e) => setPassword(e.currentTarget.value),
				},
			]}
		/>
	);
}

export default SignUpWithInstagramVerified;
