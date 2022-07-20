import { JetView } from "webix-jet";
import { PlayerPageMobile } from "./PlayerPage";

export default class PlayerPage extends JetView {
  config() {
    var tabbar = {
      view: "tabbar",
      type: "bottom",
      id: "tabbar_navbar_player",
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
      on: {
        onBeforeTabClick: function (id) {
          this.setValue(id);
          this.$scope.show("/p." + id);
        },
      },
    };

    webix.ui.fullScreen();
    return {
      rows: [PlayerPageMobile, tabbar],
    };
  }
  urlChange(view, url) {
    const pageName = url[0].page.split(".").pop();
    $$("tabbar_navbar_player").setValue(pageName);
  }
}
