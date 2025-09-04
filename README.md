# yute

Fetch YouTube transcripts from the command line.

## Usage

```bash
bunx --bun yute <url or video id>
npx yute <url or video id>
```

## With your LLM agent

Include something like this in your agent prompt:

```
When asked to fetch summarize a video, use `yute` to get the transcript:

`bunx --bun yute <url or video id> --no-newlines`
```

## License

[MIT](./LICENSE)
