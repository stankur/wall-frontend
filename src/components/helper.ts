import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);


function makeNumDigits(len: number, number: number) {
	return "0".repeat(len - number.toString().length) + number.toString();
}

function convertTimeToElapsedTime(time:string) {
    return dayjs(time).fromNow().toUpperCase()
}

interface Ranked {
	rank: number;
}

function immutableSortRank<Type extends Ranked>(arr: Type[]) {
	return [...arr].sort((before, after) => before.rank - after.rank);
}

function immutableRemove<Type>(
	arr: Type[],
	matchCondition: (elem: Type) => boolean
) {
	let index: number = arr.findIndex(matchCondition);
	if (index === -1) {
		throw new Error("no match found in the give array");
	}
	return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export {
	makeNumDigits,
	convertTimeToElapsedTime,
	immutableSortRank,
	immutableRemove,
};
