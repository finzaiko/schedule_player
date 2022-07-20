const ScheduleService = require("../services/schedule.service");

const initApp = async (app, options) => {
  const schedule = await ScheduleService.init();
  return schedule;
};

module.exports = initApp;
