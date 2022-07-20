import { JetView } from "webix-jet";
import { AlarmViewMobile } from "./AlarmView";

export default class AlarmView extends JetView {
  config() {
    webix.ui.fullScreen();
    return AlarmViewMobile;
  }
  init(view) {}
}
