import { BUNDESLAENDER, getFeiertage } from "german-holidays";
import type { Bundesland, Feiertag } from "german-holidays";
import { useState } from "react";

const STATES = Object.entries(BUNDESLAENDER) as [Bundesland, string][];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2];

function formatDate(dateStr: string): string {
	const d = new Date(dateStr);
	return d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });
}

function DayBadge({ dateStr }: { dateStr: string }) {
	const d = new Date(dateStr);
	const dow = d.getDay();
	const isWeekend = dow === 0 || dow === 6;
	return (
		<span
			className={`inline-block w-16 text-center text-xs font-mono px-2 py-0.5 rounded ${
				isWeekend ? "bg-zinc-800 text-zinc-500" : "bg-zinc-900 text-zinc-400"
			}`}
		>
			{d.toLocaleDateString("de-DE", { weekday: "short" })}
		</span>
	);
}

export function Hero() {
	const [state, setState] = useState<Bundesland>("BY");
	const [year, setYear] = useState(CURRENT_YEAR);
	const holidays = getFeiertage(year, state);

	return (
		<section className="py-20 text-center">
			<h1 className="text-5xl font-bold tracking-tight text-zinc-50 mb-4">german-holidays</h1>
			<p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
				Public holidays for all 16 German federal states. Movable holidays, bridge days, isFeiertag
				— zero dependencies.
			</p>

			{/* Controls */}
			<div className="flex flex-wrap justify-center gap-3 mb-10">
				<select
					value={state}
					onChange={(e) => setState(e.target.value as Bundesland)}
					className="px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm cursor-pointer focus:outline-none focus:border-zinc-600"
				>
					{STATES.map(([code, name]) => (
						<option key={code} value={code}>
							{name} ({code})
						</option>
					))}
				</select>

				<div className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
					{YEARS.map((y) => (
						<button
							key={y}
							type="button"
							onClick={() => setYear(y)}
							className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
								year === y ? "bg-zinc-700 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
							}`}
						>
							{y}
						</button>
					))}
				</div>
			</div>

			{/* Holiday List */}
			<div className="max-w-xl mx-auto text-left">
				<p className="text-sm text-zinc-500 mb-4">
					{holidays.length} Feiertage in {BUNDESLAENDER[state]} ({year})
				</p>
				<div className="space-y-1">
					{holidays.map((h: Feiertag) => (
						<div
							key={h.date}
							className="flex items-center gap-8 py-2 px-3 rounded-lg hover:bg-zinc-900/50 transition-colors group"
						>
							<DayBadge dateStr={h.date} />
							<span className="text-sm text-zinc-500 font-mono w-32 shrink-0">
								{formatDate(h.date)}
							</span>
							<span className="text-sm text-zinc-200">{h.name}</span>
							{h.nationwide ? (
								<span className="ml-auto text-[10px] text-zinc-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
									bundesweit
								</span>
							) : (
								<span className="ml-auto text-[10px] text-amber-700 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
									landesspezifisch
								</span>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
