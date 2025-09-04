import { test, expect } from 'bun:test'
import { formatTime, getHelpMessage, validateArgs } from './index.ts'

test('formatTime converts seconds to minutes and seconds format', () => {
	expect(formatTime(0)).toBe('0m00s')
	expect(formatTime(30)).toBe('0m30s')
	expect(formatTime(60)).toBe('1m00s')
	expect(formatTime(90)).toBe('1m30s')
	expect(formatTime(125)).toBe('2m05s')
	expect(formatTime(3661)).toBe('61m01s')
})

test('formatTime handles edge cases', () => {
	expect(formatTime(1)).toBe('0m01s')
	expect(formatTime(59)).toBe('0m59s')
	expect(formatTime(3600)).toBe('60m00s')
})

test('formatTime pads seconds with leading zero', () => {
	expect(formatTime(65)).toBe('1m05s')
	expect(formatTime(605)).toBe('10m05s')
})

test('getHelpMessage returns correct help text', () => {
	const help = getHelpMessage()
	expect(help).toContain('Usage: yute <youtube-url>')
	expect(help).toContain('Arguments:')
	expect(help).toContain('Options:')
	expect(help).toContain('Examples:')
	expect(help).toContain('-h, --help')
	expect(help).toContain('--no-newlines')
})

test('validateArgs handles help flags', () => {
	expect(validateArgs(['-h'])).toEqual({ valid: true, showHelp: true, noNewlines: false })
	expect(validateArgs(['--help'])).toEqual({ valid: true, showHelp: true, noNewlines: false })
	expect(validateArgs(['some-url', '-h'])).toEqual({
		valid: true,
		showHelp: true,
		noNewlines: false,
	})
})

test('validateArgs handles no arguments', () => {
	const result = validateArgs([])
	expect(result.valid).toBe(false)
	expect(result.showHelp).toBe(true)
	expect(result.noNewlines).toBe(false)
	expect(result.error).toContain('Please provide a YouTube URL or ID')
})

test('validateArgs handles too many arguments', () => {
	const result = validateArgs(['url1', 'url2', 'url3'])
	expect(result.valid).toBe(false)
	expect(result.showHelp).toBe(true)
	expect(result.noNewlines).toBe(false)
	expect(result.error).toContain('Please provide a YouTube URL or ID')
})

test('validateArgs handles valid single argument', () => {
	const testCases = [
		'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		'dQw4w9WgXcQ',
		'https://youtu.be/dQw4w9WgXcQ',
	]

	testCases.forEach((url) => {
		const result = validateArgs([url])
		expect(result.valid).toBe(true)
		expect(result.showHelp).toBe(false)
		expect(result.noNewlines).toBe(false)
		expect(result.videoUrl).toBe(url)
		expect(result.error).toBeUndefined()
	})
})

test('validateArgs handles --no-newlines flag', () => {
	const result = validateArgs(['--no-newlines', 'dQw4w9WgXcQ'])
	expect(result.valid).toBe(true)
	expect(result.showHelp).toBe(false)
	expect(result.noNewlines).toBe(true)
	expect(result.videoUrl).toBe('dQw4w9WgXcQ')

	const result2 = validateArgs(['dQw4w9WgXcQ', '--no-newlines'])
	expect(result2.valid).toBe(true)
	expect(result2.showHelp).toBe(false)
	expect(result2.noNewlines).toBe(true)
	expect(result2.videoUrl).toBe('dQw4w9WgXcQ')
})
