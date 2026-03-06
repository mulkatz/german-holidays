import { describe, expect, it } from "vitest";
import { getFeiertage } from "../holidays.js";
import type { Bundesland } from "../types.js";

/**
 * Comprehensive verification of holidays for all 16 German federal states.
 * Each state is tested with exact holiday names and dates for 2026.
 *
 * Easter 2026: April 5
 * Movable dates:
 *   Karfreitag:          2026-04-03 (Easter -2)
 *   Ostersonntag:        2026-04-05 (Easter)
 *   Ostermontag:         2026-04-06 (Easter +1)
 *   Christi Himmelfahrt:  2026-05-14 (Easter +39)
 *   Pfingstsonntag:      2026-05-24 (Easter +49)
 *   Pfingstmontag:       2026-05-25 (Easter +50)
 *   Fronleichnam:        2026-06-04 (Easter +60)
 *   Buß- und Bettag:    2026-11-18 (Wed before Nov 23)
 */

const NATIONWIDE_2026 = [
	{ date: "2026-01-01", name: "Neujahrstag" },
	{ date: "2026-04-03", name: "Karfreitag" },
	{ date: "2026-04-06", name: "Ostermontag" },
	{ date: "2026-05-01", name: "Tag der Arbeit" },
	{ date: "2026-05-14", name: "Christi Himmelfahrt" },
	{ date: "2026-05-25", name: "Pfingstmontag" },
	{ date: "2026-10-03", name: "Tag der Deutschen Einheit" },
	{ date: "2026-12-25", name: "1. Weihnachtstag" },
	{ date: "2026-12-26", name: "2. Weihnachtstag" },
];

/** Expected holidays per state (state-specific only, nationwide excluded) */
const STATE_SPECIFIC: Record<Bundesland, { date: string; name: string }[]> = {
	BW: [
		{ date: "2026-01-06", name: "Heilige Drei Könige" },
		{ date: "2026-06-04", name: "Fronleichnam" },
		{ date: "2026-11-01", name: "Allerheiligen" },
	],
	BY: [
		{ date: "2026-01-06", name: "Heilige Drei Könige" },
		{ date: "2026-06-04", name: "Fronleichnam" },
		{ date: "2026-08-15", name: "Mariä Himmelfahrt" },
		{ date: "2026-11-01", name: "Allerheiligen" },
	],
	BE: [{ date: "2026-03-08", name: "Internationaler Frauentag" }],
	BB: [
		{ date: "2026-04-05", name: "Ostersonntag" },
		{ date: "2026-05-24", name: "Pfingstsonntag" },
		{ date: "2026-10-31", name: "Reformationstag" },
	],
	HB: [{ date: "2026-10-31", name: "Reformationstag" }],
	HH: [{ date: "2026-10-31", name: "Reformationstag" }],
	HE: [{ date: "2026-06-04", name: "Fronleichnam" }],
	MV: [
		{ date: "2026-03-08", name: "Internationaler Frauentag" },
		{ date: "2026-10-31", name: "Reformationstag" },
	],
	NI: [{ date: "2026-10-31", name: "Reformationstag" }],
	NW: [
		{ date: "2026-06-04", name: "Fronleichnam" },
		{ date: "2026-11-01", name: "Allerheiligen" },
	],
	RP: [
		{ date: "2026-06-04", name: "Fronleichnam" },
		{ date: "2026-11-01", name: "Allerheiligen" },
	],
	SL: [
		{ date: "2026-06-04", name: "Fronleichnam" },
		{ date: "2026-08-15", name: "Mariä Himmelfahrt" },
		{ date: "2026-11-01", name: "Allerheiligen" },
	],
	SN: [
		{ date: "2026-06-04", name: "Fronleichnam" },
		{ date: "2026-10-31", name: "Reformationstag" },
		{ date: "2026-11-18", name: "Buß- und Bettag" },
	],
	ST: [
		{ date: "2026-01-06", name: "Heilige Drei Könige" },
		{ date: "2026-10-31", name: "Reformationstag" },
	],
	SH: [{ date: "2026-10-31", name: "Reformationstag" }],
	TH: [
		{ date: "2026-06-04", name: "Fronleichnam" },
		{ date: "2026-09-20", name: "Weltkindertag" },
		{ date: "2026-10-31", name: "Reformationstag" },
	],
};

/** Expected total holiday count per state */
const EXPECTED_COUNTS: Record<Bundesland, number> = {
	BW: 12,
	BY: 13,
	BE: 10,
	BB: 12,
	HB: 10,
	HH: 10,
	HE: 10,
	MV: 11,
	NI: 10,
	NW: 11,
	RP: 11,
	SL: 12,
	SN: 12,
	ST: 11,
	SH: 10,
	TH: 12,
};

describe("all states — 2026 holiday verification", () => {
	const states = Object.keys(STATE_SPECIFIC) as Bundesland[];

	for (const state of states) {
		describe(state, () => {
			const holidays = getFeiertage(2026, state);
			const expected = [...NATIONWIDE_2026, ...STATE_SPECIFIC[state]].sort((a, b) =>
				a.date.localeCompare(b.date),
			);

			it(`has exactly ${EXPECTED_COUNTS[state]} holidays`, () => {
				expect(holidays.length).toBe(EXPECTED_COUNTS[state]);
			});

			it("contains all expected holidays with correct dates", () => {
				for (const exp of expected) {
					const found = holidays.find((h) => h.name === exp.name);
					expect(found, `Missing holiday: ${exp.name}`).toBeDefined();
					expect(found?.date, `Wrong date for ${exp.name}`).toBe(exp.date);
				}
			});

			it("has no unexpected holidays", () => {
				const expectedNames = new Set(expected.map((e) => e.name));
				for (const h of holidays) {
					expect(expectedNames.has(h.name), `Unexpected holiday: ${h.name} on ${h.date}`).toBe(
						true,
					);
				}
			});
		});
	}
});

describe("multi-year movable holiday verification", () => {
	const knownEasterDates: [number, string][] = [
		[2024, "2024-03-31"],
		[2025, "2025-04-20"],
		[2026, "2026-04-05"],
		[2027, "2027-03-28"],
		[2028, "2028-04-16"],
		[2029, "2029-04-01"],
		[2030, "2030-04-21"],
	];

	for (const [year, easterDate] of knownEasterDates) {
		it(`Karfreitag is 2 days before Easter ${year}`, () => {
			const holidays = getFeiertage(year, "BY");
			const karfreitag = holidays.find((h) => h.name === "Karfreitag");
			const easterD = new Date(easterDate);
			easterD.setDate(easterD.getDate() - 2);
			const expected = easterD.toISOString().slice(0, 10);
			expect(karfreitag?.date).toBe(expected);
		});
	}

	it("Buß- und Bettag is always a Wednesday", () => {
		for (let year = 2020; year <= 2035; year++) {
			const holidays = getFeiertage(year, "SN");
			const bub = holidays.find((h) => h.name === "Buß- und Bettag");
			expect(bub, `Buß- und Bettag missing for ${year}`).toBeDefined();
			const date = new Date(bub?.date);
			expect(date.getDay(), `Buß- und Bettag ${year} is not a Wednesday`).toBe(3);
		}
	});

	it("Buß- und Bettag is always before November 23 and after November 15", () => {
		for (let year = 2020; year <= 2035; year++) {
			const holidays = getFeiertage(year, "SN");
			const bub = holidays.find((h) => h.name === "Buß- und Bettag");
			const day = Number.parseInt(bub?.date.slice(8, 10));
			expect(day).toBeGreaterThanOrEqual(16);
			expect(day).toBeLessThanOrEqual(22);
		}
	});
});
