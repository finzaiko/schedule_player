import { JetView } from "webix-jet";
import { AlarmFormMobile } from "./AlarmForm";

export default class AlarmAdd extends JetView {
  config() {
    webix.ui.fullScreen();
    return AlarmFormMobile;
  }
  init(view) {}
}
