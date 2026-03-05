import { getBrueckentage } from "./brueckentage.js";
import { getFeiertage, getGesetzlicheFeiertage } from "./holidays.js";
import { ALL_STATES, BUNDESLAENDER, isValidBundesland } from "./states.js";
import type { Bundesland } from "./types.js";

function printUsage(): void {
	console.log(`
german-holidays — German public holidays CLI

Usage:
  german-holidays <year> [state]
  german-holidays --brueckentage <year> [state]

Arguments:
  year    Year (e.g. 2026)
  state   State code (e.g. BY, NW, BE). Default: all nationwide holidays

Options:
  --brueckentage  Show bridge day opportunities
  --en            English holiday names
  --help          Show this help

State codes:
  ${ALL_STATES.map((s) => `${s} (${BUNDESLAENDER[s]})`).join("\n  ")}

Examples:
  german-holidays 2026
  german-holidays 2026 BY
  german-holidays --brueckentage 2026 NW
`);
}

function main(): void {
	const args = process.argv.slice(2);

	if (args.length === 0 || args.includes("--help")) {
		printUsage();
		process.exit(0);
	}

	const showBrueckentage = args.includes("--brueckentage");
	const useEnglish = args.includes("--en");
	const positional = args.filter((a) => !a.startsWith("--"));

	const yearStr = positional[0];
	const stateStr = positional[1]?.toUpperCase();

	if (!yearStr || Number.isNaN(Number(yearStr))) {
		console.error("Error: Please provide a valid year.\n");
		printUsage();
		process.exit(1);
	}

	const year = Number(yearStr);

	if (stateStr && !isValidBundesland(stateStr)) {
		console.error(`Error: Unknown state code "${stateStr}".`);
		console.error(`Valid codes: ${ALL_STATES.join(", ")}\n`);
		process.exit(1);
	}

	const state = stateStr as Bundesland | undefined;

	if (showBrueckentage) {
		if (!state) {
			console.error("Error: --brueckentage requires a state code.\n");
			printUsage();
			process.exit(1);
		}
		const brueckentage = getBrueckentage(year, state);
		console.log(`\nBrückentage ${year} — ${BUNDESLAENDER[state]} (${state})\n`);
		if (brueckentage.length === 0) {
			console.log("  No bridge day opportunities found.\n");
			return;
		}
		for (const bt of brueckentage) {
			console.log(
				`  ${bt.date}  ${bt.urlaubstage} vacation day(s) → ${bt.freieTage} days off (${bt.start} – ${bt.end})`,
			);
			console.log(`             ↳ ${bt.feiertag}\n`);
		}
		return;
	}

	if (state) {
		const holidays = getFeiertage(year, state, {
			lang: useEnglish ? "en" : "de",
		});
		console.log(`\nFeiertage ${year} — ${BUNDESLAENDER[state]} (${state})\n`);
		for (const h of holidays) {
			const tag = useEnglish ? h.nameEn : h.name;
			const marker = h.nationwide ? "" : " *";
			console.log(`  ${h.date}  ${tag}${marker}`);
		}
		console.log(`\n  ${holidays.length} holidays (* = state-specific)\n`);
	} else {
		const holidays = getGesetzlicheFeiertage(year, {
			lang: useEnglish ? "en" : "de",
		});
		console.log(`\nGesetzliche Feiertage ${year} (nationwide)\n`);
		for (const h of holidays) {
			const tag = useEnglish ? h.nameEn : h.name;
			console.log(`  ${h.date}  ${tag}`);
		}
		console.log(`\n  ${holidays.length} nationwide holidays\n`);
	}
}

main();
