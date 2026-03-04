import type { DateString } from "./types.js";

/** Create a DateString from year, month (1-based), day */
export function toDateString(year: number, month: number, day: number): DateString {
	const m = String(month).padStart(2, "0");
	const d = String(day).padStart(2, "0");
	return `${year}-${m}-${d}` as DateString;
}

/** Add days to a [year, month, day] tuple. Returns a new Date object. */
export function addDays(year: number, month: number, day: number, offset: number): Date {
	const date = new Date(year, month - 1, day + offset);
	return date;
}

/** Convert a Date object to DateString */
export function dateToString(d: Date): DateString {
	return toDateString(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/** Get day of week (0 = Sunday, 6 = Saturday) for a DateString */
export function dayOfWeek(ds: DateString): number {
	const [y, m, d] = ds.split("-").map(Number);
	return new Date(y, m - 1, d).getDay();
}

/** Parse a DateString or Date into [year, month (1-based), day] */
export function parseDate(input: DateString | Date): [number, number, number] {
	if (input instanceof Date) {
		return [input.getFullYear(), input.getMonth() + 1, input.getDate()];
	}
	const [y, m, d] = input.split("-").map(Number);
	return [y, m, d];
}

/** Check if a DateString falls on a weekend */
export function isWeekend(ds: DateString): boolean {
	const dow = dayOfWeek(ds);
	return dow === 0 || dow === 6;
}
