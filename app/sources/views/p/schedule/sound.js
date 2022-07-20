import { JetView } from "webix-jet";
import { state, url } from "../../../models/Alarm";
import { PlaylistForm } from "./PlaylistForm";

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
      label: "Manage Sound",
      width: 200,
      id: "title_lbl",
      css: "title_lbl",
    },
    {},
    {
      view: "icon",
      icon: "mdi mdi-plus",
      css: {
        "padding-right": "10px",
      },
      autowidth: true,
      click: function () {
        if ($$("sound_tabbar").getValue() == "sound_list") {
        } else {
          this.$scope.ui(PlaylistForm).show();
        }
      },
    },
    { width: 5 },
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
  ],
};

const panel = {
  type: "clean",
  rows: [
    {
      // borderless: true,
      view: "tabbar",
      id: "sound_tabbar",
      value: "listView",
      css: "list_bottom_border",
      value: "sound_list",
      multiview: true,
      options: [
        { value: "Sound", id: "sound_list" },
        { value: "Playlist", id: "play_list" },
      ],
    },
    {
      cells: [
        // {id:"sound_list", template:"Sound list"},
        {
          view: "list",
          id: "sound_list",
          template: "#filename#",
          select: true,
          url: `${BACKEND_URL}/api/v1/sound/files`,
        },
        // {id:"play_list", template:"Play list"},
        {
          view: "list",
          id: "play_list",
          template: "#filename#",
          select: true,
          url: `${BACKEND_URL}/api/v1/sound/playlist`,
        },
      ],
    },
  ],
};

export default class SoundPage extends JetView {
  config() {
    return {
      rows: [mToolbar, panel],
    };
  }
  init(view) {}
}
