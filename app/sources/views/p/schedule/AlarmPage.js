import { JetView } from "webix-jet";
import { state, url } from "../../../models/Alarm";
import { io } from "socket.io-client";
import { BACKEND_URL, SOCKET_URL } from "../../../config/setting";
import { FloatingButton } from "../../../helpers/component";

const sockPrefix = "zko";
let _scope;

const list = {
  view: "list",
  id: "list",
  template: "#title# <span style='float:right;'>#event_at#</span>",
  select: true,
  url: `${BACKEND_URL}/api/v1/schedule`,
  on: {
    onItemClick: function (sel) {
      const item = this.getItem(sel);
      console.log("item", item);
      state.dataSelected = item;
      this.$scope.show(`/p.schedule.view?id=${sel}`);
    },
  },
};

const mToolbar = {
  view: "toolbar",
  height: 50,
  cols: [
    {
      view: "label",
      label: "Schedule",
      width: 200,
      id: "title_lbl",
      css: "title_lbl",
    },
    {},
    {
      view: "icon",
      icon: "mdi mdi-information-outline",
      tooltip: "About",
      click: function () {
          webix.ui({
            view:"window",
            position: "center",
            head: "About Schedule Player",
            close:true,
            body: {
              template: `
              <strong>Version:</strong> 0.0.1dev<br>
                Todo Dev notes:<br>
                - more icon player, delete, rename, show detail playlist
              `
            }
          }).show();
      }
    },
  ],
};

export class AlarmPageMobile extends JetView {
  config() {
    _scope = this;
    return {
      rows: [mToolbar, list],
    };
  }
  init(v) {
    FloatingButton("schedule_add_btn", function () {
      _scope.show("/p.schedule.add");
    }).show();
    /*
    const _app = this.app;
    webix
      .ui({
        view: "window",
        css: "winbutton",
        head: false,
        body: {
          view: "button",
          value: "+",
          css: "addButton",
          width: 50,
          height: 50,
          click: function () {
            _app.show("/p.schedule.add");
          },
        },
      })
      .show({
        x: window.innerWidth - 70,
        y: window.innerHeight - 70,
      });
      */
  }

  ready() {
    const socket = io(SOCKET_URL);

    socket.on(`${sockPrefix}init`, (data) => {
      console.log("INIT>> ", data);
    });

    socket.on(`${sockPrefix}rm`, (data) => {
      console.log("LIST-RM>>", data);
      if ($$("list").exists(data)) {
        $$("list").remove(data);
      }
    });

    socket.on(`${sockPrefix}ud`, (data) => {
      console.log("LIST-UPDATE-REFRESH>>", data);
      if ($$("list")) {
        $$("list").clearAll();
        $$("list").load(`${BACKEND_URL}/api/v1/schedule`);
      }
    });

    socket.on(`${sockPrefix}nw`, (data) => {
      console.log("LIST-NW>>", data);
      if ($$("list")) {
        $$("list").add(data, 0);
      }
    });
  }

  destroy() {
    _scope = {};
    $$("schedule_add_btn").destructor();
  }
}
