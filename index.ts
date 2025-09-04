import { fetchTranscript } from "youtube-transcript-plus";

const args = process.argv.slice(2);

function showHelp() {
	console.log(`
Usage: bun run index.ts -v <youtube-url>

Options:
  --video <url>    Fetch and display transcript for YouTube video
  -h, --help       Show this help message

Examples:
  bun run index.ts --video https://www.youtube.com/watch?v=dQw4w9WgXcQ
  bun run index.ts --video dQw4w9WgXcQ
  `);
}

async function main() {
	if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
		showHelp();
		return;
	}

	const videoIndex = args.indexOf("--video");

	if (videoIndex === -1 || videoIndex + 1 >= args.length) {
		console.error("Error: --video flag requires a YouTube URL or ID");
		showHelp();
		process.exit(1);
	}

	const videoUrl = args[videoIndex + 1]!;

	try {
		console.log(`Fetching transcript for: ${videoUrl}`);
		const transcript = await fetchTranscript(videoUrl);

		console.log("\n--- TRANSCRIPT ---\n");

		transcript.forEach((item) => {
			const startTime = formatTime(item.offset);
			console.log(`[${startTime}] ${item.text}`);
		});

		console.log(`\n--- END TRANSCRIPT ---`);
		console.log(`Total segments: ${transcript.length}`);
	} catch (error: any) {
		console.error("Error fetching transcript:", error.message);
		process.exit(1);
	}
}

function formatTime(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}m${remainingSeconds.toString().padStart(2, "0")}s`;
}

main();
