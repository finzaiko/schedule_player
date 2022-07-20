import { JetView } from "webix-jet";
import { state, url } from "../../../models/Alarm";
import { defaultHeader } from "../../../helpers/api";
import { BACKEND_URL } from "../../../config/setting";

const mToolbar = {
  view: "toolbar",
  height: 50,
  cols: [
    { width: 5 },
    {
      view: "icon",
      icon: "mdi mdi-arrow-left",
      id: "back_arrow",
      click: function () {
        if (state.isEdit) {
          this.$scope.show(`/p.schedule.view?id=${state.dataSelected.id}`);
        } else {
          this.$scope.show("/p.schedule");
        }
      },
    },
    {
      view: "label",
      label: "Add Schedule",
      width: 200,
      id: "title_lbl",
      css: "title_lbl",
    },
    {},
  ],
};

const form = {
  view: "form",
  id: "form",
  elements: [
    {
      view: "text",
      label: "Title",
      name: "title",
      id: "title",
    },
    {
      view: "radio",
      name: "is_repeat",
      id: "is_repeat",
      value: 1,
      options: [
        { value: "Once", id: 1 },
        { value: "Repeat", id: 2 },
      ],
      on: {
        onChange: function (newv, oldv) {
          if (newv == 1) {
            $$("once_pnl").show();
            $$("repeat_pnl").hide();
          } else {
            $$("once_pnl").hide();
            $$("repeat_pnl").show();
          }
        },
      },
    },
    {
      rows: [
        {
          id: "once_pnl",
          rows: [
            {
              cols: [
                {
                  view: "label",
                  label: "Date time",
                  width: 80,
                },
                {
                  view: "datepicker",
                  id: "once_date",
                  format: "%d %M %Y",
                  placeholder: "Date",
                },
                {
                  view: "datepicker",
                  type: "time",
                  id: "once_time",
                  placeholder: "Time",
                  format: "%H:%i",
                  editable: true,
                },
              ],
            },
          ],
        },
        {
          id: "repeat_pnl",
          hidden: true,
          rows: [
            {
              view: "combo",
              value: "day",
              name: "rep_every",
              id: "rep_every",
              label: "Every",
              options: ["day", "week", "month", "year"],
              on: {
                onChange: function (newv, oldv) {
                  if (newv == "day") {
                    $$("rep_day").hide();
                    $$("rep_dt").hide();
                    $$("rep_time").show();
                  } else if (newv == "week") {
                    $$("rep_day").hide();
                    $$("rep_dt").hide();
                    $$("rep_time").show();
                    $$("rep_day").show();
                  } else if (newv == "month") {
                    $$("rep_day").hide();
                    $$("rep_time").hide();
                    $$("rep_dt").show();

                    let a = $$("rep_dt");
                    a.define("format", "%d %M - %H:%i");
                    a.refresh();
                  } else if (newv == "year") {
                    $$("rep_day").hide();
                    $$("rep_time").hide();
                    $$("rep_dt").show();

                    let a = $$("rep_dt");
                    a.define("format", "%d %M %Y- %H:%i");
                    a.refresh();
                  } else {
                    $$("rep_day").hide();
                    $$("rep_time").hide();
                    $$("rep_dt").hide();
                  }
                },
              },
            },
            {
              view: "combo",
              label: "Day",
              name: "rep_day",
              id: "rep_day",
              options: [
                { id: 1, value: "Monday" },
                { id: 2, value: "Tuesday" },
                { id: 3, value: "Wednesday" },
                { id: 4, value: "Thursday" },
                { id: 5, value: "Friday" },
                { id: 6, value: "Saturday" },
                { id: 7, value: "Sunday" },
              ],
              hidden: true,
            },
            {
              view: "datepicker",
              id: "rep_time",
              name: "rep_time",
              editable: true,
              type: "time",
              label: "Time",
              format: "%H:%i",
            },
            {
              view: "datepicker",
              label: "Date time",
              timepicker: true,
              hidden: true,
              editable: true,
              id: "rep_dt",
              //format: "%d/%m/%Y %H:%i",
              format: "%d %M %Y - %H:%i",
            },
          ],
        },
        {
          id: "a1",
          rows: [
            {
              responsive: "a1",
              cols: [
                {
                  view: "combo",
                  value: "audio",
                  name: "sound",
                  id: "sound",
                  label: "Sound",
                  minWidth: 250,
                  options: {
                    url: `${BACKEND_URL}/api/v1/player/sound`,
                  },
                  on: {
                    onChange: function (newv) {
                      const data = this.getPopup().getList();
                      // const s = this.getItem(newv);
                      // console.log('s',s);
                      console.log("filterCombo", data);
                      const a = data.getItem(newv);
                      console.log("a", a);
                    },
                  },
                },
                // {
                //   view: "button",
                //   type: "icon",
                //   icon: "mdi mdi-playlist-music",
                //   autowidth: true,
                //   click: function () {
                //     this.$scope.show("/p.schedule.sound");
                //   },
                // },
                {
                  view: "combo",
                  placeholder: "Repeat",
                  name: "repeat",
                  id: "repeat",
                  value: "1x",
                  width: 100,
                  options: [
                    {
                      id: "1x",
                      value: "1x",
                    },
                    {
                      id: "repeat",
                      value: "Repeat",
                    },
                  ],
                  on: {
                    onChange: function (newv) {
                      if (newv == "repeat") {
                        $$("repeat_times").show();
                        $$("repeat_times_x").show();
                        $$("repeat_times").setValue();
                      } else {
                        $$("repeat_times").hide();
                        $$("repeat_times_x").hide();
                        $$("repeat_times").setValue(1);
                      }
                    },
                  },
                },
                {
                  view: "text",
                  type: "number",
                  id: "repeat_times",
                  name: "repeat_times",
                  hidden: true,
                  placeholder: "times",
                  width: 100,
                },
                {
                  view: "label",
                  label: "x",
                  hidden: true,
                  id: "repeat_times_x",
                  autowidth: true,
                  clear: true,
                },
              ],
            },
          ],
        },
        {
          cols: [
            {
              view: "label",
              label: "Speak",
              width: 80,
            },
            {
              view: "switch",
              id: "speak",
              name: "speak",
              value: 0,
              width: 80,
              on: {
                onChange: (newv) => {
                  if (newv == 1) {
                    $$("text_speak").show();
                  } else {
                    $$("text_speak").hide();
                  }
                },
              },
            },
            {
              view: "text",
              name: "text_speak",
              id: "text_speak",
              placeholder: "Text speak",
              hidden: true,
            },
          ],
        },
      ],
    },
    {
      cols: [
        {
          view: "button",
          label: "Save",
          autowidth: true,
          css: "webix_primary",
          click: function () {
            save(this.$scope);
          },
        },
      ],
    },
  ],
};

function getDayLabel(day) {
  let dayName;
  switch (day) {
    case 1:
      dayName = "Monday";
      break;
    case 2:
      dayName = "Tuesday";
      break;
    case 3:
      dayName = "Wednesday";
      break;
    case 4:
      dayName = "Thursday";
      break;
    case 5:
      dayName = "Friday";
      break;
    case 6:
      dayName = "Saturday";
      break;
    case 7:
      dayName = "Sunday";
      break;
    default:
      dayName = "Invalid day";
  }
  return dayName;
}

function save(_this) {
  const ir = $$("is_repeat").getValue();
  let inputData = {};
  if (ir == 1) {
    const ocDate = $$("once_date").getValue();
    const ocTime = $$("once_time").getValue();
    inputData.repeat = "x";

    const y = ocDate.getFullYear();
    const m = ocDate.getMonth();
    const d = ocDate.getDate();
    const h = ocTime.getHours();
    const i = ocTime.getMinutes();

    inputData.cron = `${y}, ${m}, ${d}, ${h}, ${i}`;

    const dbDateFormat = "%Y-%m-%d";
    const dbTimeFormat = " %H:%i";
    const getDateFormat = webix.Date.dateToStr(dbDateFormat);
    const getTimeFormat = webix.Date.dateToStr(dbTimeFormat);

    inputData.event_at = `${getDateFormat(ocDate)} ${getTimeFormat(ocTime)}`;
  } else {
    const rep = $$("rep_every").getValue();

    const repTime = $$("rep_time").getValue();
    const repDt = $$("rep_dt").getValue();
    switch (rep) {
      case "day":
        inputData.repeat = "d";
        inputData.cron = `${repTime.getMinutes()} ${repTime.getHours()} * * *`;
        inputData.note = `every ${rep} at ${repTime.getHours()}:${repTime.getMinutes()}`;
        break;
      case "week":
        inputData.repeat = "w";
        inputData.cron = `${repTime.getMinutes()} ${repTime.getHours()} * * ${$$(
          "rep_day"
        ).getValue()}`;
        const d = $$("rep_day").getValue();
        console.log("d", d);
        inputData.note = `every ${rep} at ${getDayLabel(
          parseInt(d)
        )} ${repTime.getHours()}:${repTime.getMinutes()}`;
        break;
      case "month":
        inputData.repeat = "m";
        inputData.cron = `${repDt.getMinutes()} ${repDt.getHours()} ${repDt.getDate()} * *`;
        inputData.note = `every ${rep} at date ${repDt.getDate()} ${repDt.getHours()}:${repDt.getMinutes()}`;
        break;
      case "year":
        inputData.repeat = "y";
        inputData.cron = `${repDt.getMinutes()} ${repDt.getHours()} ${repDt.getDate()} ${
          repDt.getMonth() + 1
        } *`;
        inputData.note = `every ${rep} at ${repDt.getDate()}-${
          repDt.getMonth() + 1
        } ${repDt.getHours()}:${repDt.getMinutes()}`;
        break;
      default:
        inputData.repeat = "x";
        break;
    }
  }

  inputData.title = $$("title").getValue();
  inputData.sound = $$("sound").getValue();
  // inputData.sound = $$("sound").getValue();
  const data = $$("sound").getPopup().getList();
  const data2 = data.getItem($$("sound").getValue());
  console.log("data2", data2);

  inputData.sound_repeat =
    $$("repeat_times").getValue() == "" ? 1 : $$("repeat_times").getValue();
  inputData.sound_path = data2.path;
  inputData.speak = $$("speak").getValue();

  console.log("inputData", inputData);
  // console.log('_this1',_this);

  if (
    $$("repeat").getValue() == "repeat" &&
    $$("repeat_times").getValue() == ""
  ) {
    webix.html.addCss($$("repeat_times").getNode(), "webix_invalid");
    webix.message({ text: "Repeat times required", type: "error" });
    return;
  } else {
    webix.html.removeCss($$("repeat_times").$view, "webix_invalid");
  }

  if (!state.isEdit) {
    webix
      .ajax()
      .headers(defaultHeader())
      .post(`${BACKEND_URL}/api/v1/schedule`, inputData)
      .then((r) => {
        state.isEdit = false;
        state.dataSelected = {};
        _this.show("/p.schedule");
      });
  } else {
    webix
      .ajax()
      .headers(defaultHeader())
      .put(`${BACKEND_URL}/api/v1/schedule/${state.dataSelected.id}`, inputData)
      .then((r) => {
        state.isEdit = false;
        state.dataSelected = {};
        _this.show("/p.schedule");
      });
  }
  $$("title_lbl").define("label", "Schedule Alarm");
  $$("title_lbl").refresh();
}
export class AlarmFormMobile extends JetView {
  config() {
    return {
      rows: [mToolbar, form],
    };
  }
  init(view) {}
  urlChange(view, url) {
    if (url[0].page == "p.schedule.edit") {
      if (
        state.isEdit &&
        url[0].params.id &&
        typeof state.dataSelected.id != "undefined"
      ) {
        console.log("url.length", url[0].params.id);
        console.log("state.dataSelected", state.dataSelected);
        $$("title_lbl").define("label", "Edit Schedule Alarm");
        $$("title_lbl").refresh();

        $$("form").setValues(state.dataSelected);
        const dataSel = state.dataSelected;
        if (dataSel.repeat != "x") {
          // repeat
          $$("is_repeat").setValue(2);
          this.$$("rep_every").setValue(this.getRepeatLabel(dataSel.repeat));

          const cron = dataSel.cron;
          console.log("cron", cron);
          const ctime = cron.split(" ");
          console.log(ctime[0], ctime[1]);

          // day cron
          let myDate = new Date();
          myDate.setHours(ctime[1]);
          myDate.setMinutes(ctime[0]);
          $$("rep_time").setValue(myDate);
          // end: day cron

          // month cron
          let myDate2 = new Date();
          myDate2.setDate(ctime[2]);
          myDate2.setHours(ctime[1]);
          myDate2.setMinutes(ctime[0]);
          console.log("mydate2", myDate2.toString());
          $$("rep_dt").setValue(myDate2);
          // end: month cron

          console.log("dataSel", dataSel);

          if (dataSel.sound_repeat > 1) {
            $$("repeat").setValue("repeat");
          } else {
            $$("repeat").setValue("1x");
          }
          $$("repeat_times").setValue(dataSel.sound_repeat);
          // sound_repeat
        } else {
          $$("is_repeat").setValue(1);
          console.log("dataSel.event_at", dataSel.event_at);

          const cron = dataSel.cron;
          console.log("cron", cron);
          const ctime = cron.split(",");

          // let myDate3 = new Date();

          // myDate3.setDate(ctime[2]);
          // myDate3.setHours(ctime[1]);
          // myDate3.setMinutes(ctime[0]);

          let myDate3 = new Date(
            ctime[0],
            ctime[1],
            ctime[2],
            ctime[3],
            ctime[4],
            0
          );

          console.log("mydate3", myDate3.toString());
          // $$("once_date").setValue(dataSel);

          $$("once_date").setValue(new Date(myDate3));
          $$("once_time").setValue(new Date(myDate3));
        }

        // $$("once_date").setValue(new Date(dataSel.event_at));
        // $$("once_time").setValue(new Date(dataSel.event_at));
        console.log("dataSel.event_at", dataSel.event_at);
      } else {
        state.isEdit = false;
        state.dataSelected = {};
        this.show("/p.schedule");
      }
    }
  }

  getRepeatLabel(stateRepeat) {
    switch (stateRepeat) {
      case "d":
        return "day";
      case "w":
        return "day";
      case "m":
        return "month";
      case "y":
        return "year";
      default:
        return "no";
    }
  }
}
