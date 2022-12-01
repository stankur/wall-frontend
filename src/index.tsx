import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./routes/Main";
import SignUp from "./routes/SignUp";
import SignIn from "./routes/SignIn";
import AddImage from "./routes/AddImage";
import ExpandedPost from "./routes/ExpandedPost";
import CropImage from "./routes/CropImage";
import { useAnalytics, useWrapper } from "./hooks/analyticsHooks";

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
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/add-image" element={<AddImage />} />
					<Route path="/images/:id" element={<ExpandedPost />} />
					<Route path="/crop-image" element={<CropImage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
