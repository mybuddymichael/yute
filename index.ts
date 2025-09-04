import { fetchTranscript } from 'youtube-transcript-plus'

const args = process.argv.slice(2)

function showHelp() {
	console.log(`
Usage: yute <youtube-url>

Arguments:
  <youtube-url>    YouTube URL or video ID to fetch transcript

Options:
  -h, --help       Show this help message

Examples:
  npx yute https://www.youtube.com/watch?v=dQw4w9WgXcQ
  bunx yute dQw4w9WgXcQ
  yute dQw4w9WgXcQ   # if installed globally
  `)
}

async function main() {
	if (args.includes('-h') || args.includes('--help')) {
		showHelp()
		return
	}

	if (args.length !== 1) {
		console.error('Error: Please provide exactly one argument (YouTube URL or ID)')
		showHelp()
		process.exit(1)
	}

	const videoUrl = args[0]!

	try {
		console.log(`Fetching transcript for: ${videoUrl}`)
		const transcript = await fetchTranscript(videoUrl)

		console.log('\n--- TRANSCRIPT ---\n')

		transcript.forEach((item) => {
			const startTime = formatTime(item.offset)
			console.log(`[${startTime}] ${item.text}`)
		})

		console.log(`\n--- END TRANSCRIPT ---`)
		console.log(`Total segments: ${transcript.length}`)
	} catch (error: any) {
		console.error('Error fetching transcript:', error.message)
		process.exit(1)
	}
}

function formatTime(seconds: number): string {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = Math.floor(seconds % 60)
	return `${minutes}m${remainingSeconds.toString().padStart(2, '0')}s`
}

main()
