import { useState } from "react";

function useStats(id: string, points: number, likes: number, dislikes: number) {
	const [internalPoints, setInternalPoints] = useState(points);
	const [internalLikes, setInternalLikes] = useState(likes);
	const [internalDislikes, setInternalDislikes] = useState(dislikes);

    const [likingImage, setLoading] = useState(false);


}

export { useStats };
