import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./routes/Main";
import SignUpWithEmail from "./routes/authentication/SignUpWithEmail";
import SignInWithEmail from "./routes/authentication/SignInWithEmail";
import AddImage from "./routes/AddImage";
import ExpandedPost from "./routes/ExpandedPost";
import CropImage from "./routes/CropImage";
import { useAnalytics, useWrapper } from "./hooks/analyticsHooks";
import VerifyEmail from "./routes/authentication/VerifyEmail";
import ChooseSignUp from "./routes/authentication/ChooseSignUp";
import SignUpWithInstagram from "./routes/authentication/SignUpWithInstagram";
import VerifyInstagram from "./routes/authentication/VerifyInstagram";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<Router />
	</React.StrictMode>
);

interface WrapperProps {
	initialized: boolean;
	children: React.PropsWithChildren<any>;
}

function Wrapper({ initialized, children }: WrapperProps) {
	useWrapper(initialized);

	return <>{children}</>;
}

function Router() {
	const [initialized] = useAnalytics();

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<Wrapper initialized={initialized}>
							<App />
						</Wrapper>
					}
				>
					<Route index element={<Main />} />
					<Route path="sign-up" element={<ChooseSignUp />} />
					<Route
						path="/sign-up-with-email"
						element={<SignUpWithEmail />}
					/>
					<Route
						path="/sign-up-with-instagram"
						element={<SignUpWithInstagram />}
					/>
					<Route
						path="/verify-instagram"
						element={<VerifyInstagram />}
					/>
					<Route path="/sign-in" element={<SignInWithEmail />} />
					<Route path="/add-image" element={<AddImage />} />
					<Route path="/images/:id" element={<ExpandedPost />} />
					<Route path="/crop-image" element={<CropImage />} />
					<Route path="/verify-email" element={<VerifyEmail />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
