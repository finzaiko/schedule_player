const ScheduleRepository = require(`../repositories/schedule.repository`);
const schedule = require("node-schedule");
const ScheduleDto = require("../dtos/schedule.dto");
const { playSound } = require("../utils/sound.util");
const SocketService = require("./socket.service");

class ScheduleService {
  async init() {
    const jobList = await ScheduleRepository.getAll();

    let i = 1;
    setInterval(function () {
      // process.stdout.write(">>>> Tik.. " + i + "s \r");
      i++;
    }, 1000);

    jobList.forEach((job) => {
      console.log("init --> " + JSON.stringify(job));
      schedule.scheduleJob(job.id + "j", job.cron, () => {
        console.log(
          "Jobs --> " +
            JSON.stringify(job) +
            " -- " +
            new Date().toLocaleTimeString()
        );
        i = 1;
        playSound("mpg123", job.sound, job.sound_repeat);
        if (job.repeat == "x") {
          console.log("canceld-->", job.id);

          SocketService.emit("zkorm", job.id);

          schedule.cancelJob(job.id + "j");
        }
      });
    });
    return true;
  }

  async getAll() {
    return await ScheduleRepository.getAll();
  }

  async save(data, id) {
    let sched = new ScheduleDto();
    sched.title = data.title;
    sched.note = data.note;
    sched.repeat = data.repeat;
    sched.event_at = data.event_at;
    sched.cron = data.cron;
    sched.sound = data.sound;
    sched.sound_path = data.sound_path;
    sched.sound_repeat = data.sound_repeat;
    sched.sound = data.sound;
    sched.speak = data.speak;
    sched.status = 1;

    let sch = 0;
    if (typeof id == "undefined") {
      sch = await ScheduleRepository.create(sched);
    } else {
      sch = await ScheduleRepository.update(sched, id);
    }

    var job = Object.assign({ id: sch.last_id }, data);

    console.log("init-new --> " + JSON.stringify(job));

    if (typeof id == "undefined") {
      SocketService.emit("zkonw", job);
    } else {
      SocketService.emit("zkoud", job);
    }

    let _cron;
    _cron = job.cron;

    if (data.repeat == "x") {
      const ds = data.cron.split(",");
      _cron = new Date(ds[0], ds[1], ds[2], ds[3], ds[4], 0);
    }

    console.log("_cron", _cron);

    schedule.scheduleJob(job.id + "j", _cron, () => {
      console.log(
        "Jobs --> " +
          JSON.stringify(job) +
          " -- " +
          new Date().toLocaleTimeString()
      );
      playSound(job.sound_path, job.sound, job.sound_repeat);
      if (job.repeat == "x") {
        console.log("canceld-create-->", job.id);

        schedule.cancelJob(job.id + "j");

        SocketService.emit("zkorm", job.id);

        // TODO: delete from db this id
        this.delete(job.id);
      }
    });

    return job;
  }

  async delete(id) {
    return await ScheduleRepository.delete(id);
  }
}

module.exports = new ScheduleService();
