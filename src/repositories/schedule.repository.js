const { db } = require("../core/database");

class ScheduleRepository {
  async getAll() {
    const sql = `SELECT 
                  id,
                  title, 
                  repeat, 
                  event_at,
                  CASE WHEN event_at IS NULL THEN note ELSE strftime('%d-%m-%Y %H:%M', event_at) END event_at, 
                  cron, 
                  sound, 
                  speak, 
                  status,
                  sound_repeat, 
                  sound_path
              FROM schedule ORDER BY id DESC`;
    const res = await new Promise((resolve, reject) => {
      db.all(sql, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    return res;
  }

  async create(data) {
    const sql = `INSERT INTO schedule (
        title, 
        note, 
        repeat, 
        event_at, 
        cron, 
        sound, 
        speak, 
        status,
        sound_path,
        sound_repeat
      ) VALUES (
        ?,
        NULLIF(?,''),
        ?,
        NULLIF(?,''),
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )`;
    let params = [
      data.title,
      data.note,
      data.repeat,
      data.event_at,
      data.cron,
      data.sound,
      data.speak,
      data.status,
      data.sound_path,
      data.sound_repeat,
    ];
    const res = await new Promise((resolve, reject) => {
      db.serialize(() => {
        var stmt = db.prepare(sql);
        stmt.run(params, function (err,row) {  
          if (err) reject(err);
          resolve({last_id: this.lastID});
        });
      });
    });
    return res;
  }


  async update(data, id) {
    const sql = `UPDATE schedule SET
        title=?, 
        note=?, 
        repeat=?, 
        event_at=?, 
        cron=?, 
        sound=?, 
        speak=?, 
        status=?,
        sound_path=?,
        sound_repeat=?
     WHERE id=?`;
    let params = [
      data.title,
      data.note,
      data.repeat,
      data.event_at,
      data.cron,
      data.sound,
      data.speak,
      data.status,
      data.sound_path,
      data.sound_repeat,
      id
    ];
    const res = await new Promise((resolve, reject) => {
      db.serialize(() => {
        var stmt = db.prepare(sql);
        stmt.run(params, function (err,row) {  
          if (err) reject(err);
          resolve({last_id: id});
        });
      });
    });
    return res;
  }

  async delete(id) {
    const sql = "DELETE FROM schedule WHERE id=?";
    let params = [id];
    const res = await new Promise((resolve, reject) => {
      db.run(sql, params, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    return res;
  }

}

module.exports = new ScheduleRepository();
