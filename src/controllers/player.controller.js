const PlayerService = require(`../services/player.service`);
const fs = require("fs");

const { readPlaylistFile, readFilesSync } = require("../utils/files.util");
const { PLAYLIST_PATH, AUDIO_PATH } = require("../config/contant");

class PlayerController {
  async play(request, reply) {
    const { path, file, loop, type } = request.body;
    console.log("type", type);
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
      cPath = PLAYLIST_PATH;
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
    if (request.file) {
      // const pathUpload = path.join(__dirname, "../../uploads/");
      // console.log('pathUpload>>>>>>>>>>>>>>',pathUpload);

      const oriName = request.file.originalname;
      var newResult = oriName.substring(0, oriName.lastIndexOf("."));
      var newName = newResult.replace(/[^A-Z0-9]/gi, "_");

      fs.renameSync(
        request.file.path,
        request.file.destination + `${newName}.mp3`
      );
    }

    return reply
      .code(201)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send({ status: "server" });
  }

  async playlistAdd(request, reply) {
    const { playlist, path, file } = request.body;

    fs.open(`${PLAYLIST_PATH}/${playlist}.txt`, "a", function (e, id) {
      fs.write(id, `${path}/${file}` + "\r\n", null, "utf8", function () {
        fs.close(id, function () {
          console.log("file is updated");
        });
      });
    });

    return reply
      .code(201)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send({ status: "server" });
  }

  async playlistDetail(request, reply) {
    const { file, checked } = request.query;

    let audio = readFilesSync(AUDIO_PATH);

    if (file) {
      const playlist = await readPlaylistFile(PLAYLIST_PATH, `${file}.txt`);
      var playlistMark = playlist.map((obj) => {
        return Object.assign(obj, { checked: true });
      });

      var leftUsers = audio.filter(
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
    const sound = readFilesSync(AUDIO_PATH);

    const s = sound.map((obj) => {
      return { id: obj.file, value: obj.file, path: obj.path, type: "s" };
    });

    const playlist = readFilesSync(PLAYLIST_PATH);

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
    const files = readFilesSync(PLAYLIST_PATH);
    reply
      .code(200)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send(files);
  }
}

module.exports = new PlayerController();
