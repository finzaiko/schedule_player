const PlayerController = require("../../controllers/player.controller");
const multer = require("fastify-multer");
const { AUDIO_MAX_SIZE, AUDIO_PATH } = require("../../config/contant");
const sysPath = require("path");

const audioFilter = function (req, file, cb) {
  console.log('file////////////////////',file);

  if (!file.originalname.match(/\.(mp3|MP3|wav|WAV)$/)) {
    req.fileValidationError = "Only mp3/wav files are allowed!";
    return cb(new Error("Only mp3/wav files are allowed!"), false);
  }
  cb(null, true);
};

const audioPath = sysPath.join(__dirname, "../../../" + AUDIO_PATH);

const limitsUpload = {
  fileSize: AUDIO_MAX_SIZE, //15MB 15*1048576
  files: 1,
};
const upload = multer({
  dest: audioPath,
  fileFilter: audioFilter,
  limits: limitsUpload,
});

module.exports = async (fastify) => {
  fastify.get(`/stop`, PlayerController.stop);
  fastify.post(`/remove`, PlayerController.removeFile);
  fastify.post(`/rename`, PlayerController.renameFile);
  fastify.get(`/playlist`, PlayerController.playlist);
  fastify.post(`/play`, PlayerController.play);
  fastify.get(`/sound`, PlayerController.getFiles);
  fastify.get(`/playlist_sound`, PlayerController.getFiles);
  fastify.get(`/playlist_detail`, PlayerController.playlistDetail);
  fastify.post(`/playlist_add`, PlayerController.playlistAdd);
  fastify.post(
    `/addsound`,
    { preHandler: upload.single("upload") },
    PlayerController.soundAdd
  );
};
