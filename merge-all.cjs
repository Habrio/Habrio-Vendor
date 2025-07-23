const fs = require("fs");
const path = require("path");

const OUTPUT_FILE = "full-frontend-code.txt";
const ALLOWED_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".css", ".json"];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const files = [];
walkDir("./src", function(filePath) {
  if (ALLOWED_EXTENSIONS.includes(path.extname(filePath))) {
    files.push(filePath);
  }
});

let output = "";

files.forEach(file => {
  const content = fs.readFileSync(file, "utf-8");
  output += `\n===== FILE: ${file} =====\n\n${content}\n`;
});

fs.writeFileSync(OUTPUT_FILE, output);
console.log(`✅ Merged ${files.length} files into ${OUTPUT_FILE}`);
