import { JetView } from "webix-jet";
import { AlarmPageMobile } from "./AlarmPage";

export default class AlarmPage extends JetView {
  config() {
    var tabbar = {
      view: "tabbar",
      type: "bottom",
      id: "tabbar_navbar_schedule",
      multiview: true,
      options: [
        {
          value:
            "<span class='webix_icon mdi mdi-alarm'></span><span style='padding-left: 4px'>Schedule</span>",
          id: "schedule",
        },
        {
          value:
            "<span class='webix_icon mdi mdi-play'></span><span style='padding-left: 4px'>Player</span>",
          id: "player",
        },
      ],
      height: 50,
      value: "player",
      on: {
        onBeforeTabClick: function (id) {
          this.setValue(id);
          this.$scope.app.show("p." + id);
        },
      },
    };

    webix.ui.fullScreen();
    return {
      rows: [AlarmPageMobile, tabbar],
    };
  }
  init(view) {}
  urlChange(view, url) {
    const pageName = url[0].page.split(".").pop();
    $$("tabbar_navbar_schedule").setValue(pageName);
  }
}
