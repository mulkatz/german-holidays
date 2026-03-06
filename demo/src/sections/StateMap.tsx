import { BUNDESLAENDER, getFeiertage } from "german-holidays";
import type { Bundesland } from "german-holidays";

const STATES = Object.entries(BUNDESLAENDER) as [Bundesland, string][];
const YEAR = new Date().getFullYear();

export function StateMap() {
	return (
		<section className="py-20">
			<h2 className="text-3xl font-bold tracking-tight text-zinc-50 mb-3">Alle 16 Bundesländer</h2>
			<p className="text-zinc-400 mb-8 max-w-xl">
				Every state has different holidays. The number ranges from 10 (Berlin, Hamburg, Bremen,
				Niedersachsen, Schleswig-Holstein) to 13 (Bayern).
			</p>

			<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
				{STATES.map(([code, name]) => {
					const count = getFeiertage(YEAR, code).length;
					return (
						<div
							key={code}
							className="p-3 rounded-lg border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
						>
							<div className="flex items-baseline justify-between">
								<span className="text-xs font-mono text-zinc-400">{code}</span>
								<span className="text-lg font-bold text-zinc-200">{count}</span>
							</div>
							<p className="text-xs text-zinc-500 mt-1 truncate">{name}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
