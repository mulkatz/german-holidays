import { describe, expect, it } from "vitest";
import { ALL_STATES, BUNDESLAENDER, isValidBundesland } from "../states.js";

describe("states", () => {
	it("has 16 states", () => {
		expect(ALL_STATES.length).toBe(16);
	});

	it("has names for all states", () => {
		for (const code of ALL_STATES) {
			expect(BUNDESLAENDER[code]).toBeDefined();
			expect(BUNDESLAENDER[code].length).toBeGreaterThan(0);
		}
	});

	it("validates correct state codes", () => {
		expect(isValidBundesland("BY")).toBe(true);
		expect(isValidBundesland("NW")).toBe(true);
		expect(isValidBundesland("BE")).toBe(true);
	});

	it("rejects invalid state codes", () => {
		expect(isValidBundesland("XX")).toBe(false);
		expect(isValidBundesland("")).toBe(false);
		expect(isValidBundesland("bavaria")).toBe(false);
	});
});
