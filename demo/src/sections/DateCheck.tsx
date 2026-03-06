import { BUNDESLAENDER, isFeiertag } from "german-holidays";
import type { Bundesland, DateString } from "german-holidays";
import { useState } from "react";

const STATES = Object.entries(BUNDESLAENDER) as [Bundesland, string][];

function todayString(): string {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function DateCheck() {
	const [date, setDate] = useState(todayString());
	const [state, setState] = useState<Bundesland>("BY");

	const result = isFeiertag(date as DateString, state);

	return (
		<section className="py-20">
			<h2 className="text-3xl font-bold tracking-tight text-zinc-50 mb-3">isFeiertag</h2>
			<p className="text-zinc-400 mb-8 max-w-xl">
				Check if any date is a public holiday in a specific state. Returns the holiday details or
				undefined.
			</p>

			<div className="flex flex-wrap gap-3 mb-6">
				<input
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-zinc-600 [color-scheme:dark]"
				/>
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
			</div>

			<div className="max-w-md">
				{result ? (
					<div className="p-4 rounded-lg border border-zinc-700/50 bg-zinc-900/50">
						<p className="text-sm text-zinc-50 font-medium mb-2">Feiertag!</p>
						<div className="space-y-1 text-sm">
							<p>
								<span className="text-zinc-500">name:</span>{" "}
								<span className="text-zinc-200">"{result.name}"</span>
							</p>
							<p>
								<span className="text-zinc-500">nameEn:</span>{" "}
								<span className="text-zinc-200">"{result.nameEn}"</span>
							</p>
							<p>
								<span className="text-zinc-500">date:</span>{" "}
								<span className="text-zinc-200">"{result.date}"</span>
							</p>
							<p>
								<span className="text-zinc-500">nationwide:</span>{" "}
								<span className="text-zinc-200">{result.nationwide ? "true" : "false"}</span>
							</p>
						</div>
					</div>
				) : (
					<div className="p-4 rounded-lg border border-zinc-800/50">
						<p className="text-sm text-zinc-500">
							{date} is not a public holiday in {BUNDESLAENDER[state]}.
						</p>
						<p className="text-xs text-zinc-600 mt-1 font-mono">→ undefined</p>
					</div>
				)}
			</div>

			{/* Code preview */}
			<div className="mt-6 max-w-md">
				<pre className="text-xs text-zinc-500 bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-3 overflow-x-auto">
					<code>{`isFeiertag("${date}", "${state}")
// → ${result ? `{ name: "${result.name}", ... }` : "undefined"}`}</code>
				</pre>
			</div>
		</section>
	);
}
