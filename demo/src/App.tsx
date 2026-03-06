import { Brueckentage } from "./sections/Brueckentage";
import { DateCheck } from "./sections/DateCheck";
import { Hero } from "./sections/Hero";
import { StateMap } from "./sections/StateMap";

export function App() {
	return (
		<div className="min-h-screen">
			<div className="max-w-5xl mx-auto px-6">
				<Hero />

				<hr className="border-zinc-800" />
				<Brueckentage />

				<hr className="border-zinc-800" />
				<DateCheck />

				<hr className="border-zinc-800" />
				<StateMap />

				<hr className="border-zinc-800" />

				{/* Footer */}
				<footer className="py-16 text-center">
					<p className="text-sm text-zinc-500 mb-4">Install</p>
					<code className="inline-block px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm">
						npm install german-holidays
					</code>
					<div className="mt-8 flex justify-center gap-6 text-sm text-zinc-500">
						<a
							href="https://github.com/mulkatz/german-holidays"
							className="hover:text-zinc-300 transition-colors"
						>
							GitHub
						</a>
						<a
							href="https://npmjs.com/package/german-holidays"
							className="hover:text-zinc-300 transition-colors"
						>
							npm
						</a>
						<span className="text-zinc-700">&lt;2KB gzipped</span>
					</div>
					<p className="mt-8 text-xs text-zinc-600">MIT License</p>
				</footer>
			</div>
		</div>
	);
}
