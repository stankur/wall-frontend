import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";

function useAnalytics(): [boolean] {
	const [initialized, setInitialized] = useState(false);

	useEffect(
		function () {
			if (!initialized) {
				ReactGA.initialize(
					process.env.REACT_APP_GA_MEASUREMENT_ID as string
				);
				setInitialized(true);
			}
		},
		[initialized]
	);

	return [initialized];
}

function useWrapper(initialized: boolean) {
	const location = useLocation();

	useEffect(function () {
		if (initialized) {
			ReactGA.send({
				hitType: "pageview",
				page: location.pathname + location.search,
			});
		}
	});
}

export { useAnalytics, useWrapper };
