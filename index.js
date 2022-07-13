const fs = require("fs");
const path = require("path");

const chainsPath = path.join(__dirname, "chains", "_data", "chains");

// Iterate over files in ./chains/_data/chains
const map = {};   // Map chain ID to name
fs.readdirSync(chainsPath).forEach(chainFileName => {
  const chainFilePath = path.join(chainsPath, chainFileName);
  const chainFile = fs.readFileSync(chainFilePath, "utf8");
  const { name, chainId } = JSON.parse(chainFile);
  map[chainId] = name;
});

// Ganache is active, "CENNZnet old" isn't
if (map["1337"] === "CENNZnet old" || map["1337"] === undefined) {
  map["1337"] = "Ganache";
}

// Write to file, entries ordered by chain id
const outFile = path.join(__dirname, "chainIDtoName.json");
const writeStream = fs.createWriteStream(outFile);

writeStream.write("{\n");

const orderedChainIDs = Object.keys(map).sort((a, b) => Number(a) - Number(b));
orderedChainIDs.forEach((chainId, index) => {
  writeStream.write(`  "${chainId}": "${map[chainId]}"`);
  if (index !== orderedChainIDs.length - 1) {
    writeStream.write(",\n");
  }
});

writeStream.write("\n}\n");

writeStream.on("finish", () => void console.log("Done 🎉"));
writeStream.close();
