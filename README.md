# RS School NodeJS course

## Task 1. Caesar cipher CLI tool

**Implement CLI tool that will encode and decode a text by Caesar cipher**

CLI tool accept 4 options:

1.  **-s, --shift**: a shift
2.  **-i, --input**: an input file
3.  **-o, --output**: an output file
4.  **-a, --action**: an action encode/decode

**Usage example:**

```bash
$ node my-caesar-chiper-cli -a encode -s 7 -i "./input.txt" -o "./output.txt"
```

```bash
$ node my-caesar-chiper-cli --action encode --shift 7 --input plain.txt --output encoded.txt
```

```bash
$ node my-caesar-chiper-cli --action decode --shift 7 --input decoded.txt --output plain.txt
```