import { addDays, dateToString, toDateString } from "./date-utils.js";
import { easterSunday } from "./easter.js";
import type { Bundesland, DateString, Feiertag, HolidayOptions } from "./types.js";

interface HolidayDef {
	name: string;
	nameEn: string;
	nationwide: boolean;
	/** Which states observe this holiday (empty = all) */
	states?: Bundesland[];
}

type HolidayEntry = HolidayDef & { date: DateString };

function fixedHolidays(year: number): HolidayEntry[] {
	return [
		{
			date: toDateString(year, 1, 1),
			name: "Neujahrstag",
			nameEn: "New Year's Day",
			nationwide: true,
		},
		{
			date: toDateString(year, 1, 6),
			name: "Heilige Drei Könige",
			nameEn: "Epiphany",
			nationwide: false,
			states: ["BW", "BY", "ST"],
		},
		{
			date: toDateString(year, 3, 8),
			name: "Internationaler Frauentag",
			nameEn: "International Women's Day",
			nationwide: false,
			states: ["BE", "MV"],
		},
		{
			date: toDateString(year, 5, 1),
			name: "Tag der Arbeit",
			nameEn: "Labour Day",
			nationwide: true,
		},
		{
			date: toDateString(year, 8, 15),
			name: "Mariä Himmelfahrt",
			nameEn: "Assumption of Mary",
			nationwide: false,
			states: ["BY", "SL"],
		},
		{
			date: toDateString(year, 9, 20),
			name: "Weltkindertag",
			nameEn: "World Children's Day",
			nationwide: false,
			states: ["TH"],
		},
		{
			date: toDateString(year, 10, 3),
			name: "Tag der Deutschen Einheit",
			nameEn: "German Unity Day",
			nationwide: true,
		},
		{
			date: toDateString(year, 10, 31),
			name: "Reformationstag",
			nameEn: "Reformation Day",
			nationwide: false,
			states: ["BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"],
		},
		{
			date: toDateString(year, 11, 1),
			name: "Allerheiligen",
			nameEn: "All Saints' Day",
			nationwide: false,
			states: ["BW", "BY", "NW", "RP", "SL"],
		},
		{
			date: toDateString(year, 12, 25),
			name: "1. Weihnachtstag",
			nameEn: "Christmas Day",
			nationwide: true,
		},
		{
			date: toDateString(year, 12, 26),
			name: "2. Weihnachtstag",
			nameEn: "St. Stephen's Day",
			nationwide: true,
		},
	];
}

function movableHolidays(year: number): HolidayEntry[] {
	const [eMonth, eDay] = easterSunday(year);
	const easter = (offset: number): DateString => {
		const d = addDays(year, eMonth, eDay, offset);
		return dateToString(d);
	};

	return [
		{
			date: easter(-2),
			name: "Karfreitag",
			nameEn: "Good Friday",
			nationwide: true,
		},
		{
			date: easter(0),
			name: "Ostersonntag",
			nameEn: "Easter Sunday",
			nationwide: false,
			states: ["BB"],
		},
		{
			date: easter(1),
			name: "Ostermontag",
			nameEn: "Easter Monday",
			nationwide: true,
		},
		{
			date: easter(39),
			name: "Christi Himmelfahrt",
			nameEn: "Ascension Day",
			nationwide: true,
		},
		{
			date: easter(49),
			name: "Pfingstsonntag",
			nameEn: "Whit Sunday",
			nationwide: false,
			states: ["BB"],
		},
		{
			date: easter(50),
			name: "Pfingstmontag",
			nameEn: "Whit Monday",
			nationwide: true,
		},
		{
			date: easter(60),
			name: "Fronleichnam",
			nameEn: "Corpus Christi",
			nationwide: false,
			states: ["BW", "BY", "HE", "NW", "RP", "SL", "SN", "TH"],
		},
	];
}

/** Buß- und Bettag: the last Wednesday on or before November 22 (Nov 16–22) */
function bussUndBettag(year: number): DateString {
	const nov22 = new Date(year, 10, 22);
	const dow = nov22.getDay();
	const offset = (dow - 3 + 7) % 7;
	const d = new Date(year, 10, 22 - offset);
	return dateToString(d);
}

function allHolidays(year: number): HolidayEntry[] {
	const holidays = [...fixedHolidays(year), ...movableHolidays(year)];

	holidays.push({
		date: bussUndBettag(year),
		name: "Buß- und Bettag",
		nameEn: "Repentance and Prayer Day",
		nationwide: false,
		states: ["SN"],
	});

	return holidays;
}

/**
 * Get all public holidays for a given year and state.
 */
export function getFeiertage(
	year: number,
	bundesland: Bundesland,
	options?: HolidayOptions,
): Feiertag[] {
	const lang = options?.lang ?? "de";
	const all = allHolidays(year);

	return all
		.filter((h) => h.nationwide || !h.states || h.states.includes(bundesland))
		.map((h) => ({
			date: h.date,
			name: lang === "en" ? h.nameEn : h.name,
			nameEn: h.nameEn,
			nationwide: h.nationwide,
		}))
		.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Check if a given date is a public holiday in the specified state.
 */
export function isFeiertag(date: DateString | Date, bundesland: Bundesland): Feiertag | undefined {
	const ds = date instanceof Date ? dateToString(date) : date;
	const [y] = ds.split("-").map(Number);
	const holidays = getFeiertage(y, bundesland);
	return holidays.find((h) => h.date === ds);
}

/**
 * Get all nationwide holidays for a given year.
 */
export function getGesetzlicheFeiertage(year: number, options?: HolidayOptions): Feiertag[] {
	const lang = options?.lang ?? "de";
	const all = allHolidays(year);

	return all
		.filter((h) => h.nationwide)
		.map((h) => ({
			date: h.date,
			name: lang === "en" ? h.nameEn : h.name,
			nameEn: h.nameEn,
			nationwide: true,
		}))
		.sort((a, b) => a.date.localeCompare(b.date));
}
