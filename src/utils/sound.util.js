const shell = require("shelljs");
const { PLAYLIST_PATH } = require("../config/contant");

const playSound = (path, sound, loopTimes = 1) => {
  const cmdMpg123 = `mpg123 --loop ${loopTimes} ${path}/${sound}`;
  var fileExt = sound.split(".").pop();

  let audio;
  if (fileExt == "mp3") {
    audio = shell.exec(cmdMpg123, { async: true }, (code) => {
      return code;
    });
  } else {
    const cmdList = `mpg123 --quiet --listentry 0 --loop ${loopTimes} --list ${path}/${sound}`;
    audio = shell.exec(cmdList, { async: true }, (code) => {
      return code;
    });
  }

  return audio;
};

const playListSound = (playlist) => {
  let audio = shell.exec(
    `mpg123 --quiet --listentry 0 --list ${PLAYLIST_PATH}/${playlist}`,
    { async: true },
    (code) => {
      return code;
    }
  );

  return audio;
};

const mpgStopAll = () => {
  return shell.exec("pkill mpg123", { silent: true }).output;
};

module.exports = {
  playSound,
  playListSound,
  mpgStopAll,
};
