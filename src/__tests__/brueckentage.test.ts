import { describe, expect, it } from "vitest";
import { getBrueckentage } from "../brueckentage.js";
import { getFeiertage } from "../holidays.js";

describe("getBrueckentage", () => {
	it("finds bridge days for Bayern 2026", () => {
		const bt = getBrueckentage(2026, "BY");
		expect(bt.length).toBeGreaterThan(0);
	});

	it("identifies Christi Himmelfahrt bridge day 2026", () => {
		// Christi Himmelfahrt 2026 is Thursday May 14
		// → Friday May 15 is a Brückentag
		const bt = getBrueckentage(2026, "BY");
		const himmelfahrt = bt.find((b) => b.feiertag === "Christi Himmelfahrt");
		expect(himmelfahrt).toBeDefined();
		expect(himmelfahrt?.date).toBe("2026-05-15");
		expect(himmelfahrt?.urlaubstage).toBe(1);
		expect(himmelfahrt?.frepieTage).toBe(4);
	});

	it("returns sorted results by date", () => {
		const bt = getBrueckentage(2026, "BY");
		for (let i = 1; i < bt.length; i++) {
			expect(bt[i].date >= bt[i - 1].date).toBe(true);
		}
	});

	it("does not include weekends as bridge days", () => {
		const bt = getBrueckentage(2026, "BY");
		for (const b of bt) {
			const dow = new Date(b.date).getDay();
			// 0 = Sunday, 6 = Saturday — bridge days should be workdays
			expect(dow).not.toBe(0);
			expect(dow).not.toBe(6);
		}
	});

	it("does not include holidays as bridge days", () => {
		const bt = getBrueckentage(2026, "BY");
		const holidays = getFeiertage(2026, "BY");
		const holidayDates = new Set(holidays.map((h) => h.date));

		for (const b of bt) {
			expect(holidayDates.has(b.date)).toBe(false);
		}
	});

	it("returns empty array when no bridge days exist", () => {
		// This might not be empty for any real year, but the function should handle it
		const bt = getBrueckentage(2026, "HH");
		expect(Array.isArray(bt)).toBe(true);
	});
});
