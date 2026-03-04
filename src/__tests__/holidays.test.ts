import { describe, expect, it } from "vitest";
import { getFeiertage, getGesetzlicheFeiertage, isFeiertag } from "../holidays.js";

describe("getFeiertage", () => {
	it("returns correct number of holidays for Bayern 2026", () => {
		const holidays = getFeiertage(2026, "BY");
		// BY has: 9 nationwide + Heilige Drei Könige + Mariä Himmelfahrt + Fronleichnam + Allerheiligen = 13
		expect(holidays.length).toBe(13);
	});

	it("returns correct number of holidays for Berlin 2026", () => {
		const holidays = getFeiertage(2026, "BE");
		// BE has: 9 nationwide + Internationaler Frauentag = 10
		expect(holidays.length).toBe(10);
	});

	it("returns correct number of holidays for Sachsen 2026", () => {
		const holidays = getFeiertage(2026, "SN");
		// SN has: 9 nationwide + Reformationstag + Fronleichnam + Buß- und Bettag = 12
		expect(holidays.length).toBe(12);
	});

	it("returns holidays sorted by date", () => {
		const holidays = getFeiertage(2026, "BY");
		for (let i = 1; i < holidays.length; i++) {
			expect(holidays[i].date >= holidays[i - 1].date).toBe(true);
		}
	});

	it("returns English names when lang=en", () => {
		const holidays = getFeiertage(2026, "BY", { lang: "en" });
		const neujahr = holidays.find((h) => h.date === "2026-01-01");
		expect(neujahr?.name).toBe("New Year's Day");
	});

	it("returns German names by default", () => {
		const holidays = getFeiertage(2026, "BY");
		const neujahr = holidays.find((h) => h.date === "2026-01-01");
		expect(neujahr?.name).toBe("Neujahrstag");
	});

	it("correctly includes state-specific holidays", () => {
		const byHolidays = getFeiertage(2026, "BY");
		const hhHolidays = getFeiertage(2026, "HH");

		// Heilige Drei Könige should be in BY but not HH
		expect(byHolidays.some((h) => h.name === "Heilige Drei Könige")).toBe(true);
		expect(hhHolidays.some((h) => h.name === "Heilige Drei Könige")).toBe(false);
	});

	it("calculates Karfreitag correctly for 2026", () => {
		// Easter 2026 is April 5, so Karfreitag is April 3
		const holidays = getFeiertage(2026, "BY");
		const karfreitag = holidays.find((h) => h.name === "Karfreitag");
		expect(karfreitag?.date).toBe("2026-04-03");
	});

	it("calculates Christi Himmelfahrt correctly for 2026", () => {
		// Easter 2026 is April 5, so Himmelfahrt is May 14
		const holidays = getFeiertage(2026, "BY");
		const himmelfahrt = holidays.find((h) => h.name === "Christi Himmelfahrt");
		expect(himmelfahrt?.date).toBe("2026-05-14");
	});

	it("calculates Pfingstmontag correctly for 2026", () => {
		// Easter 2026 is April 5, so Pfingstmontag is May 25
		const holidays = getFeiertage(2026, "BY");
		const pfingsten = holidays.find((h) => h.name === "Pfingstmontag");
		expect(pfingsten?.date).toBe("2026-05-25");
	});

	it("calculates Buß- und Bettag correctly for Sachsen 2026", () => {
		// Nov 23, 2026 is Monday, so Buß- und Bettag is Wednesday Nov 18
		const holidays = getFeiertage(2026, "SN");
		const buss = holidays.find((h) => h.name === "Buß- und Bettag");
		expect(buss?.date).toBe("2026-11-18");
	});

	it("includes Reformationstag for Brandenburg", () => {
		const holidays = getFeiertage(2026, "BB");
		expect(holidays.some((h) => h.name === "Reformationstag")).toBe(true);
	});

	it("does not include Reformationstag for Bayern", () => {
		const holidays = getFeiertage(2026, "BY");
		expect(holidays.some((h) => h.name === "Reformationstag")).toBe(false);
	});
});

describe("isFeiertag", () => {
	it("returns holiday for Neujahrstag", () => {
		const result = isFeiertag("2026-01-01", "BY");
		expect(result).toBeDefined();
		expect(result?.name).toBe("Neujahrstag");
	});

	it("returns undefined for non-holiday", () => {
		const result = isFeiertag("2026-03-15", "BY");
		expect(result).toBeUndefined();
	});

	it("works with Date objects", () => {
		const result = isFeiertag(new Date(2026, 0, 1), "BY");
		expect(result).toBeDefined();
		expect(result?.name).toBe("Neujahrstag");
	});

	it("respects state-specific holidays", () => {
		// Heilige Drei Könige is a holiday in BY but not HH
		expect(isFeiertag("2026-01-06", "BY")).toBeDefined();
		expect(isFeiertag("2026-01-06", "HH")).toBeUndefined();
	});
});

describe("getGesetzlicheFeiertage", () => {
	it("returns only nationwide holidays", () => {
		const holidays = getGesetzlicheFeiertage(2026);
		expect(holidays.every((h) => h.nationwide)).toBe(true);
		expect(holidays.length).toBe(9);
	});
});
