import { type ChildProcess, spawn } from "node:child_process";
import { type Page, chromium } from "playwright";

const WIDTH = 800;
const HEIGHT = 600;
const DEV_URL = "http://localhost:5173";

async function waitForServer(url: string, timeout = 15000): Promise<void> {
	const start = Date.now();
	while (Date.now() - start < timeout) {
		try {
			const res = await fetch(url);
			if (res.ok) return;
		} catch {
			// not ready yet
		}
		await new Promise((r) => setTimeout(r, 500));
	}
	throw new Error(`Server at ${url} did not start within ${timeout}ms`);
}

async function startDevServer(): Promise<ChildProcess> {
	const proc = spawn("npm", ["run", "dev"], {
		cwd: new URL("../demo", import.meta.url).pathname,
		stdio: "pipe",
	});
	await waitForServer(DEV_URL);
	return proc;
}

async function wait(ms: number): Promise<void> {
	return new Promise((r) => setTimeout(r, ms));
}

async function smoothMove(
	page: Page,
	startX: number,
	startY: number,
	endX: number,
	endY: number,
	steps = 20,
	stepDelay = 30,
) {
	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		const ease = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
		const x = startX + (endX - startX) * ease;
		const y = startY + (endY - startY) * ease;
		await page.mouse.move(x, y);
		await wait(stepDelay);
	}
}

async function record() {
	console.log("Starting demo dev server...");
	const server = await startDevServer();

	try {
		console.log("Launching browser...");
		const browser = await chromium.launch();
		const context = await browser.newContext({
			viewport: { width: WIDTH, height: HEIGHT },
			recordVideo: {
				dir: "./tmp-video",
				size: { width: WIDTH, height: HEIGHT },
			},
		});

		const page = await context.newPage();
		await page.goto(DEV_URL);
		await page.waitForSelector("h1");
		await wait(2000);

		// Hover over some holidays to show the labels
		const firstHoliday = page.locator('[class*="hover:bg-zinc"]').first();
		const box = await firstHoliday.boundingBox();
		if (box) {
			await smoothMove(page, 400, 100, box.x + box.width / 2, box.y + box.height / 2);
			await wait(600);
		}

		// Switch to Berlin
		await page.selectOption("select", { value: "BE" });
		await wait(1200);

		// Switch to Sachsen
		await page.selectOption("select", { value: "SN" });
		await wait(1200);

		// Switch back to Bayern
		await page.selectOption("select", { value: "BY" });
		await wait(600);

		// Scroll to Brückentage section
		await page.evaluate(() => {
			document.querySelector("h2")?.scrollIntoView({ behavior: "smooth" });
		});
		await wait(1500);

		// Hover over bridge day entries
		const bridgeEntries = page.locator('[class*="border-zinc-800/50"]');
		const count = await bridgeEntries.count();
		for (let i = 0; i < Math.min(count, 3); i++) {
			const entry = bridgeEntries.nth(i);
			const entryBox = await entry.boundingBox();
			if (entryBox) {
				await smoothMove(
					page,
					400,
					300,
					entryBox.x + entryBox.width / 2,
					entryBox.y + entryBox.height / 2,
					15,
					25,
				);
				await wait(500);
			}
		}

		await wait(800);

		// Scroll to isFeiertag section
		await page.evaluate(() => {
			const headings = document.querySelectorAll("h2");
			headings[1]?.scrollIntoView({ behavior: "smooth" });
		});
		await wait(1000);

		// Type a holiday date
		const dateInput = page.locator('input[type="date"]');
		await dateInput.fill("2026-12-25");
		await wait(1200);

		// Type a non-holiday
		await dateInput.fill("2026-07-15");
		await wait(1000);

		// Scroll to state overview
		await page.evaluate(() => {
			const headings = document.querySelectorAll("h2");
			headings[2]?.scrollIntoView({ behavior: "smooth" });
		});
		await wait(1500);

		console.log("Recording complete. Saving video...");
		await context.close();
		await browser.close();

		console.log("Video saved to tmp-video/");
	} finally {
		server.kill();
	}
}

record().catch((err) => {
	console.error("Recording failed:", err);
	process.exit(1);
});
