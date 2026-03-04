import { describe, expect, it } from "vitest";
import { easterSunday } from "../easter.js";

describe("easterSunday", () => {
	it("calculates known Easter dates correctly", () => {
		// Well-known Easter Sunday dates
		const cases: [number, number, number][] = [
			[2020, 4, 12],
			[2021, 4, 4],
			[2022, 4, 17],
			[2023, 4, 9],
			[2024, 3, 31],
			[2025, 4, 20],
			[2026, 4, 5],
			[2027, 3, 28],
			[2028, 4, 16],
			[2029, 4, 1],
			[2030, 4, 21],
		];

		for (const [year, expectedMonth, expectedDay] of cases) {
			const [month, day] = easterSunday(year);
			expect(month).toBe(expectedMonth);
			expect(day).toBe(expectedDay);
		}
	});
});
