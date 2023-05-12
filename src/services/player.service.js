const { playSound, playListSound, mpgStopAll, volumeUpDown, volumeMuteToggle } = require("../utils/sound.util");

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

  async volumeUpDown(upDown) {
    return volumeUpDown(upDown);
  }

  async volumeUpDown(upDown) {
    return volumeUpDown(upDown);
  }

  async volumeMuteToggle(upDown) {
    return volumeMuteToggle(upDown);
  }

}

module.exports = new PlayerService();
