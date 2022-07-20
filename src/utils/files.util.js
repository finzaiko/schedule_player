// const exec = require("child_process").exec;
const fs = require("fs");
const path = require("path");
const readline = require("readline");


const readFiles = (dir, processFile) => {
  // read directory
  fs.readdir(dir, (error, fileNames) => {
    if (error) throw error;

    fileNames.forEach((filename) => {
      // get current file name
      const name = path.parse(filename).name;
      // get current file extension
      const ext = path.parse(filename).ext;
      // get current file path
      const filepath = path.resolve(dir, filename);

      // get information about the file
      fs.stat(filepath, function (error, stat) {
        if (error) throw error;

        // check if the current path is a file or a folder
        const isFile = stat.isFile();

        // exclude folders
        if (isFile) {
          // callback, do something with the file
          processFile(filepath, name, ext, stat);
        }
      });
    });
  });
};

function readFilesSync(dir) {
  const files = [];

  fs.readdirSync(dir).forEach((filename) => {
    const name = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    const filepath = path.resolve(dir, filename);
    const dirPath = path.resolve(dir);
    const stat = fs.statSync(filepath);
    const isFile = stat.isFile();

    // if (isFile) files.push({ filepath, name, ext, stat });
    if (isFile) files.push({ path: dirPath, file: `${name}${ext}` });
  });

  files.sort((a, b) => {
    // natural sort alphanumeric strings
    // https://stackoverflow.com/a/38641281
    return a.file.localeCompare(b.file, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  return files;
}

async function readPlaylistFile(path, file) {
  // const file = "playlist3.txt";
  // const path = "/home/fin/Projects/zpersonal/schedule_player/playlist";
  const fileStream = fs.createReadStream(`${path}/${file}`);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  let arr = [];
  for await (const line of rl) {
    // console.log(`Line from file: ${line}`);
    var ePath = line.slice(0, line.lastIndexOf("/") + 1);
    var eFile = line.slice(line.lastIndexOf("/") + 1);

    arr.push({ path: ePath, file: eFile });
  }

  console.log('arr',arr);
  
  return arr;
}

module.exports = {
  readFiles,
  readFilesSync,
  readPlaylistFile,
};


// https://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object
// https://stackoverflow.com/questions/44719553/node-read-the-content-of-all-files-in-a-directory-and-directories-inside-that-d