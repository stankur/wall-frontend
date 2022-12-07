import { useEffect, useRef, useState } from "react";

function useIsSticky(): [React.RefObject<HTMLDivElement>, boolean] {
	const [isSticky, setIsSticky] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(function () {
		const currentRef = ref.current;

		if (currentRef) {
			const observer = new IntersectionObserver(
				function ([event]) {
					return setIsSticky(event.intersectionRatio < 1);
				},
				{
					threshold: [1],
				}
			);

			observer.observe(currentRef);

			return function () {
				observer.unobserve(currentRef);
			};
		}
	}, []);

	return [ref, isSticky];
}

export { useIsSticky };
