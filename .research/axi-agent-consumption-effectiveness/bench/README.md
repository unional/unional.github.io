# Reproducing the measurement

```sh
npm i gpt-tokenizer @toon-format/toon yaml smol-toml
node bench.mjs   # list output across N, header cost, samples
node bench2.mjs  # detail view, errors, wide rows, session compounding
```

Tokenizer is `o200k_base` (gpt-4o) — the same encoding family the official TOON suite uses.
Not a Claude tokenizer: relative ordering transfers, absolute counts do not.
