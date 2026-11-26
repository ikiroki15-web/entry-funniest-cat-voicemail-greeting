# Funniest Cat Voicemail Greeting

[![make.fun](https://make.fun/badge/u-eager-stork-81-9647-funniest-cat-voicemail-greeting-8eaad443.svg)](https://make.fun/c/u-eager-stork-81-9647-funniest-cat-voicemail-greeting-8eaad443)

One line, 120 characters at most: the funniest voicemail greeting a cat would record.

## The greeting

> Hi, it's Miso. I'm napping in the box your package came in. Leave a message — I'll knock it off the shelf at 4 a.m.

## How it works

`greeting.txt` holds the greeting. `main.ts` (Node 22, no dependencies) reads it,
checks it is a single non-blank line of at most 120 characters, and writes it
unchanged to `/output/entry.txt`. The output is deterministic: every run
produces the exact same bytes.

## Run it

```sh
node main.ts
cat /output/entry.txt
```

## License

MIT — see [LICENSE](LICENSE).
