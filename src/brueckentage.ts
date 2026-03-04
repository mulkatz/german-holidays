import { addDays, dateToString, dayOfWeek, isWeekend } from "./date-utils.js";
import { getFeiertage } from "./holidays.js";
import type { Brueckentag, Bundesland, DateString } from "./types.js";

/**
 * Calculate Brückentage (bridge days) for a given year and state.
 * A Brückentag is a workday between a holiday and a weekend that,
 * when taken as vacation, creates a longer consecutive break.
 */
export function getBrueckentage(year: number, bundesland: Bundesland): Brueckentag[] {
	const holidays = getFeiertage(year, bundesland);
	const holidaySet = new Set(holidays.map((h) => h.date));
	const results: Brueckentag[] = [];

	for (const holiday of holidays) {
		const dow = dayOfWeek(holiday.date);

		// Holiday on Tuesday → Monday is a Brückentag
		if (dow === 2) {
			const monday = dateToString(addDays(...splitDate(holiday.date), -1));
			if (!holidaySet.has(monday) && !isWeekend(monday)) {
				const saturday = dateToString(addDays(...splitDate(holiday.date), -3));
				results.push({
					date: monday,
					feiertag: holiday.name,
					urlaubstage: 1,
					frepieTage: 4,
					start: saturday,
					end: holiday.date,
				});
			}
		}

		// Holiday on Thursday → Friday is a Brückentag
		if (dow === 4) {
			const friday = dateToString(addDays(...splitDate(holiday.date), 1));
			if (!holidaySet.has(friday) && !isWeekend(friday)) {
				const sunday = dateToString(addDays(...splitDate(holiday.date), 3));
				results.push({
					date: friday,
					feiertag: holiday.name,
					urlaubstage: 1,
					frepieTage: 4,
					start: holiday.date,
					end: sunday,
				});
			}
		}

		// Holiday on Wednesday → take Monday+Tuesday or Thursday+Friday for 5 days off
		if (dow === 3) {
			const monday = dateToString(addDays(...splitDate(holiday.date), -2));
			const tuesday = dateToString(addDays(...splitDate(holiday.date), -1));
			const saturday = dateToString(addDays(...splitDate(holiday.date), -3));
			if (
				!holidaySet.has(monday) &&
				!holidaySet.has(tuesday) &&
				!isWeekend(monday) &&
				!isWeekend(tuesday)
			) {
				results.push({
					date: monday,
					feiertag: holiday.name,
					urlaubstage: 2,
					frepieTage: 5,
					start: saturday,
					end: holiday.date,
				});
			}

			const thursday = dateToString(addDays(...splitDate(holiday.date), 1));
			const friday = dateToString(addDays(...splitDate(holiday.date), 2));
			const sunday = dateToString(addDays(...splitDate(holiday.date), 4));
			if (
				!holidaySet.has(thursday) &&
				!holidaySet.has(friday) &&
				!isWeekend(thursday) &&
				!isWeekend(friday)
			) {
				results.push({
					date: thursday,
					feiertag: holiday.name,
					urlaubstage: 2,
					frepieTage: 5,
					start: holiday.date,
					end: sunday,
				});
			}
		}
	}

	// Deduplicate by date (same vacation day might connect to multiple holidays)
	const seen = new Set<string>();
	const deduplicated: Brueckentag[] = [];
	for (const bt of results.sort((a, b) => a.date.localeCompare(b.date))) {
		if (!seen.has(bt.date)) {
			seen.add(bt.date);
			deduplicated.push(bt);
		}
	}

	return deduplicated;
}

function splitDate(ds: DateString): [number, number, number] {
	const [y, m, d] = ds.split("-").map(Number);
	return [y, m, d];
}
