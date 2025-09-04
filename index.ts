import { fetchTranscript } from 'youtube-transcript-plus'

const args = process.argv.slice(2)

export function getHelpMessage(): string {
	return `
Usage: yute <youtube-url>

Arguments:
  <youtube-url>    YouTube URL or video ID to fetch transcript for

Options:
  -h, --help       Show this help message
  --no-newlines    Output transcript segments without newlines between them

Examples:
  npx yute https://www.youtube.com/watch?v=dQw4w9WgXcQ
  bunx yute dQw4w9WgXcQ
  yute dQw4w9WgXcQ   # if installed globally
  yute --no-newlines dQw4w9WgXcQ   # compact output
  `
}

function showHelp(): void {
	console.log(getHelpMessage())
}

export function validateArgs(args: string[]): {
	valid: boolean
	showHelp: boolean
	noNewlines: boolean
	error?: string
	videoUrl?: string
} {
	if (args.includes('-h') || args.includes('--help')) {
		return { valid: true, showHelp: true, noNewlines: false }
	}

	const noNewlines = args.includes('--no-newlines')
	const filteredArgs = args.filter((arg) => arg !== '--no-newlines')

	if (filteredArgs.length !== 1) {
		return {
			valid: false,
			showHelp: true,
			noNewlines: false,
			error: 'Error: Please provide a YouTube URL or ID',
		}
	}

	return { valid: true, showHelp: false, noNewlines, videoUrl: filteredArgs[0] }
}

async function main(): Promise<void> {
	const validation = validateArgs(args)

	if (validation.showHelp) {
		showHelp()
		if (!validation.valid) {
			console.error(validation.error)
			process.exit(1)
		}
		return
	}

	const videoUrl = validation.videoUrl!
	const noNewlines = validation.noNewlines

	try {
		console.log(`Fetching transcript for: ${videoUrl}`)
		const transcript = await fetchTranscript(videoUrl)

		console.log('\n--- TRANSCRIPT ---\n')

		if (noNewlines) {
			const transcriptText = transcript
				.map((item) => {
					const startTime = formatTime(item.offset)
					return `[${startTime}] ${item.text}`
				})
				.join(' ')
			console.log(transcriptText)
		} else {
			transcript.forEach((item) => {
				const startTime = formatTime(item.offset)
				console.log(`[${startTime}] ${item.text}`)
			})
		}

		console.log(`\n--- END TRANSCRIPT ---`)
		console.log(`Total segments: ${transcript.length}`)
	} catch (error: unknown) {
		console.error(
			'Error fetching transcript:',
			error instanceof Error ? error.message : String(error),
		)
		process.exit(1)
	}
}

export function formatTime(seconds: number): string {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = Math.floor(seconds % 60)
	return `${minutes}m${remainingSeconds.toString().padStart(2, '0')}s`
}

if (import.meta.main) {
	main()
}
