import { BUNDESLAENDER, getBrueckentage } from "german-holidays";
import type { Brueckentag, Bundesland } from "german-holidays";
import { useState } from "react";

const STATES = Object.entries(BUNDESLAENDER) as [Bundesland, string][];
const CURRENT_YEAR = new Date().getFullYear();

function EfficiencyBar({ urlaubstage, freieTage }: { urlaubstage: number; freieTage: number }) {
	const ratio = freieTage / urlaubstage;
	const width = Math.min(ratio * 20, 100);
	return (
		<div className="flex items-center gap-2">
			<div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
				<div
					className="h-full bg-zinc-500 rounded-full transition-all"
					style={{ width: `${width}%` }}
				/>
			</div>
			<span className="text-xs text-zinc-500 font-mono">{ratio.toFixed(1)}x</span>
		</div>
	);
}

export function Brueckentage() {
	const [state, setState] = useState<Bundesland>("BY");
	const [year, setYear] = useState(CURRENT_YEAR);
	const bridges = getBrueckentage(year, state);

	return (
		<section className="py-20">
			<h2 className="text-3xl font-bold tracking-tight text-zinc-50 mb-3">Brückentage-Rechner</h2>
			<p className="text-zinc-400 mb-8 max-w-xl">
				Find the optimal vacation days — take minimal days off, get maximum consecutive free days.
				The efficiency ratio shows days off per vacation day.
			</p>

			<div className="flex flex-wrap gap-3 mb-8">
				<select
					value={state}
					onChange={(e) => setState(e.target.value as Bundesland)}
					className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm cursor-pointer focus:outline-none focus:border-zinc-600"
				>
					{STATES.map(([code, name]) => (
						<option key={code} value={code}>
							{name}
						</option>
					))}
				</select>
				<div className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
					{[CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2].map((y) => (
						<button
							key={y}
							type="button"
							onClick={() => setYear(y)}
							className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
								year === y ? "bg-zinc-700 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
							}`}
						>
							{y}
						</button>
					))}
				</div>
			</div>

			{bridges.length === 0 ? (
				<p className="text-zinc-500 text-sm">No bridge day opportunities for this selection.</p>
			) : (
				<div className="space-y-3">
					{bridges.map((bt: Brueckentag) => (
						<div
							key={bt.date}
							className="p-4 rounded-lg border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
						>
							<div className="flex items-start justify-between gap-4 flex-wrap">
								<div>
									<p className="text-sm text-zinc-200 font-medium">
										{bt.urlaubstage === 1 ? "1 Urlaubstag" : `${bt.urlaubstage} Urlaubstage`}
										{" → "}
										<span className="text-zinc-50">{bt.freieTage} Tage frei</span>
									</p>
									<p className="text-xs text-zinc-500 mt-1">
										{bt.start} bis {bt.end} · wegen {bt.feiertag}
									</p>
								</div>
								<EfficiencyBar urlaubstage={bt.urlaubstage} freieTage={bt.freieTage} />
							</div>
						</div>
					))}
					<p className="text-xs text-zinc-600 mt-4">
						{bridges.reduce((sum, bt) => sum + bt.urlaubstage, 0)} Urlaubstage →{" "}
						{bridges.reduce((sum, bt) => sum + bt.freieTage, 0)} Tage frei insgesamt
					</p>
				</div>
			)}
		</section>
	);
}
