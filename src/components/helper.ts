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

export { makeNumDigits, convertTimeToElapsedTime, immutableSortRank };
