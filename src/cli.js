import arg from "arg";
import { appendFileSync } from "fs";
const {
  readdirSync,
  readFileSync,
  openSync,
  closeSync,
  writeSync,
} = require("fs");

function parseRgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--in": String,
      "--out": String,
      "-i": "--in",
      "-o": "--out",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    input: args["--in"],
    output: args["--out"],
  };
}

function rebuild(input, output) {
  const filenames = readdirSync(process.cwd() + "/" + input);
  const sorted = filenames.sort((a, b) => a.split(".")[0] - b.split(".")[0]);

  const outFile = `${process.cwd()}/${output}`;
  closeSync(openSync(outFile, "w"));

  for (const filename of sorted) {
    const file = readFileSync(`${process.cwd()}/${input}/${filename}`);
    appendFileSync(outFile, file);
  }
}

export async function cli(args) {
  const { input, output } = parseRgumentsIntoOptions(args);
  if (!input || !output) {
    console.error("Input and Output are requried");
    process.exit(1);
  }

  rebuild(input, output);
}
