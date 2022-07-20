class ScheduleDto {
  get title() {
    return this._title;
  }

  set title(new_title) {
    this._title = new_title;
  }

  get note() {
    return this._note;
  }

  set note(new_note) {
    this._note = new_note;
  }

  get repeat() {
    return this._repeat;
  }

  set repeat(new_repeat) {
    this._repeat = new_repeat;
  }

  get event_at() {
    return this._event_at;
  }

  set event_at(new_event_at) {
    this._event_at = new_event_at;
  }

  get cron() {
    return this._cron;
  }

  set cron(new_cron) {
    this._cron = new_cron;
  }

  get sound() {
    return this._sound;
  }

  set sound(new_sound) {
    this._sound = new_sound;
  }

  get speak() {
    return this._speak;
  }

  set speak(new_speak) {
    this._speak = new_speak;
  }

  get status() {
    return this._status;
  }

  set status(new_status) {
    this._status = new_status;
  }

  get sound_path() {
    return this._sound_path;
  }

  set sound_path(new_sound_path) {
    this._sound_path = new_sound_path;
  }

  get sound_repeat() {
    return this._sound_repeat;
  }

  set sound_repeat(new_sound_repeat) {
    this._sound_repeat = new_sound_repeat;
  }
}

module.exports = ScheduleDto;
