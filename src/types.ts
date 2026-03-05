/** All 16 German federal states plus a BUND (nationwide) option */
export type Bundesland =
	| "BW"
	| "BY"
	| "BE"
	| "BB"
	| "HB"
	| "HH"
	| "HE"
	| "MV"
	| "NI"
	| "NW"
	| "RP"
	| "SL"
	| "SN"
	| "ST"
	| "SH"
	| "TH";

/** Date string in ISO format YYYY-MM-DD */
export type DateString = `${number}-${string}-${string}`;

/** A single public holiday */
export interface Feiertag {
	/** ISO date string (YYYY-MM-DD) */
	date: DateString;
	/** German name of the holiday */
	name: string;
	/** English name of the holiday */
	nameEn: string;
	/** Whether this is a nationwide holiday */
	nationwide: boolean;
}

/** A Brückentag (bridge day) opportunity */
export interface Brueckentag {
	/** ISO date string of the vacation day to take */
	date: DateString;
	/** The holiday this bridge day connects to */
	feiertag: string;
	/** Number of vacation days needed */
	urlaubstage: number;
	/** Total consecutive days off (including weekends) */
	freieTage: number;
	/** Start of the consecutive days off */
	start: DateString;
	/** End of the consecutive days off */
	end: DateString;
}

/** Options for holiday retrieval */
export interface HolidayOptions {
	/** Language for holiday names. Default: 'de' */
	lang?: "de" | "en";
}
