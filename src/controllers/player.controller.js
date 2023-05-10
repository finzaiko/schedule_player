const PlayerService = require(`../services/player.service`);
const fs = require("fs");
const sysPath = require("path");

const { readPlaylistFile, readFilesSync } = require("../utils/files.util");
const { PLAYLIST_PATH, AUDIO_PATH } = require("../config/contant");

class PlayerController {
  async play(request, reply) {
    const { path, file, loop, type } = request.body;
    this.audioMpg123 = await PlayerService.play(type, path, file, loop);
    reply
      .code(201)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send("Sound playing..");
  }

  async stop(request, reply) {
    this.mAudio = await PlayerService.mpgStopAll();
    reply
      .code(201)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send("StopAll");
  }

  async removeFile(request, reply) {
    const { path, file, type } = request.body;
    console.log("type", type);
    let cPath = "";
    if (type == "p" && typeof path == "undefined") {
      const playlistPath = sysPath.join(__dirname, "../../" + PLAYLIST_PATH);
      console.log("playlistPath", playlistPath);

      cPath = playlistPath;
    } else {
      cPath = path;
    }

    try {
      fs.unlinkSync(`${cPath}/${file}.txt`);
    } catch (err) {
      console.error(err);
    }
    reply
      .code(201)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send("File Removed");
  }

  async renameFile(request, reply) {
    const { path, file, type, new_name } = request.body;

    const newName = new_name.replace(/[^A-Z0-9]/gi, "_");

    fs.rename(
      `${path}/${file}`,
      `${path}/${newName}.${type == "s" ? "mp3" : "txt"}`,
      (err) => {
        if (err) console.log(err);
      }
    );

    reply
      .code(201)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send("File Renamed");
  }

  async playlist(request, reply) {
    const files = readFilesSync(PLAYLIST_PATH);
    reply
      .code(200)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send(files);
  }

  async soundAdd(request, reply) {
    console.log('request/////////////',request.file);

    if (request.file) {
      const oriName = request.file.originalname;
      let newResult = oriName.substring(0, oriName.lastIndexOf("."));
      let newName = newResult.replace(/[^A-Z0-9]/gi, "_");
      fs.renameSync(
        request.file.path,
        request.file.destination + `/${newName}.mp3`
      );
    }

    return reply
      .code(201)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send({ status: "server" });
  }

  async playlistAdd(request, reply) {
    const { playlist, path, file, checked } = request.body;

    if (typeof checked == "undefined" || checked == false) {
      const plName = playlist.toLowerCase().replace(/[^A-Z0-9]/gi, "_");
      fs.open(
        `${PLAYLIST_PATH}/${plName}.txt`,
        "a",
        function (e, id) {
          fs.write(id, `${path}/${file}` + "\r\n", null, "utf8", function () {
            fs.close(id, function () {
              console.log("file is updated");
            });
          });
        }
      );
    } else {
      console.log("LOG: not implement yet!\nTODO: Delete playlist");
    }

    return reply
      .code(201)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send({ status: "server" });
  }

  async playlistDetail(request, reply) {
    const { file, checked } = request.query;
    let audioPath = sysPath.join(__dirname, "../../" + AUDIO_PATH);
    let audio = readFilesSync(audioPath);

    if (file) {
      const playlist = await readPlaylistFile(PLAYLIST_PATH, `${file}.txt`);
      let playlistMark = playlist.map((obj) => {
        return Object.assign(obj, { checked: true });
      });

      let leftUsers = audio.filter(
        (u) => playlistMark.findIndex((lu) => lu.file === u.file) === -1
      );

      audio = leftUsers.concat(playlistMark);
    }

    audio.sort((a, b) => {
      return (typeof b.checked == "undefined" ? false : b.checked) - a.checked;
    });

    const selected = audio.filter((el) => {
      if (typeof el.checked != "undefined") {
        return el;
      }
    });
    const data = checked == "true" ? selected : audio;

    reply
      .code(200)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send(data);
  }

  async getFiles(request, reply) {
    const audioPath = sysPath.join(__dirname, "../../" + AUDIO_PATH);
    const playlistPath = sysPath.join(__dirname, "../../" + PLAYLIST_PATH);

    const sound = readFilesSync(audioPath);

    const s = sound.map((obj) => {
      return { id: obj.file, value: obj.file, path: obj.path, type: "s" };
    });

    const playlist = readFilesSync(playlistPath);

    const p = playlist.map((obj) => {
      return { id: obj.file, value: obj.file, path: obj.path, type: "p" };
    });

    const allData = s.concat(p);

    reply
      .code(200)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send(allData);
  }

  async getPlaylistFiles(reply) {
    const files = readFilesSync(playlistPath);
    reply
      .code(200)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send(files);
  }
}

module.exports = new PlayerController();
