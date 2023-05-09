const { playSound, playListSound, mpgStopAll } = require("../utils/sound.util");

class PlayerService {
  async play(type, path, file, loopTimes) {
    if (type == "s") {
      return playSound(path, file, loopTimes);
    } else {
      return playListSound(file, loopTimes);
    }
  }

  async playListSound(playlist) {
    return playListSound(playlist);
  }

  async mpgStopAll() {
    return mpgStopAll();
  }

}

module.exports = new PlayerService();
