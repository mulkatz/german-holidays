import type { Bundesland } from "./types.js";

/** Map of state codes to German names */
export const BUNDESLAENDER: Record<Bundesland, string> = {
	BW: "Baden-Württemberg",
	BY: "Bayern",
	BE: "Berlin",
	BB: "Brandenburg",
	HB: "Bremen",
	HH: "Hamburg",
	HE: "Hessen",
	MV: "Mecklenburg-Vorpommern",
	NI: "Niedersachsen",
	NW: "Nordrhein-Westfalen",
	RP: "Rheinland-Pfalz",
	SL: "Saarland",
	SN: "Sachsen",
	ST: "Sachsen-Anhalt",
	SH: "Schleswig-Holstein",
	TH: "Thüringen",
};

/** All valid state codes */
export const ALL_STATES: Bundesland[] = Object.keys(BUNDESLAENDER) as Bundesland[];

/** Check if a string is a valid Bundesland code */
export function isValidBundesland(code: string): code is Bundesland {
	return code in BUNDESLAENDER;
}
