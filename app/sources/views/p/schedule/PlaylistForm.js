import { JetView } from "webix-jet";
import { BACKEND_URL } from "../../../config/setting";
import { state, url } from "../../../models/Alarm";

const prefix = state.prefix;

function WindowForm() {
  let labelW = 100,
    winId = prefix + "_win";
  return {
    view: "window",
    modal: true,
    id: winId,
    position: "center",
    fullscreen: true,
    // head:"Playlist",
    head: {
      view: "toolbar",
      cols: [
        { width: 38 },
        { view: "label", label: "Playlist", align: "center" },
        {
          view: "icon",
          icon: "mdi mdi-close",
          align: "right",
          click: function () {
            $$(winId).close();
          },
        },
      ],
    },
    body: {
      rows: [
        {
          padding: 10,
          view: "form",
          id: prefix + "_form",
          width: 400,
          type: "clean",
          elements: [
            {
              view: "text",
              placeholder: "Playlist name..",
              name: "playlist_name",
            },
          ],
          rules: {
            lable_size_inc: webix.rules.isNotEmpty,
          },
          on: {
            onAfterValidation: function (result, value) {
              if (!result) {
                var text = [];
                for (var key in value) {
                  if (key == "lable_size_inc")
                    webix.message({ type: "error", text: text.join("<br>") });
                }
              }
            },
          },
          elementsConfig: {
            labelPosition: "left",
            labelWidth: labelW,
            bottomPadding: 1,
          },
        },
        {
          view: "list",
          id: "playlist_sound_list",
          // template: "#filename#",
          // template:
          //   "#filename#<span class='webix_icon mdi mdi-check remove-icon' title='Remove'></span>",
          template: function (obj) {
            let html = `${
              obj.filename
            }<span class='webix_icon switcher remove-icon mdi mdi-${
              obj.checked ? "check" : "check"
            }'></span>`;
            return html;
          },
          select: true,
          url: `${BACKEND_URL}/api/v1/sound/files`,
          onClick: {
            "remove-icon": function (ev, id) {
              //   remove(id);
              return false;
            },
			"switcher": function(ev, id) {
				var checked = this.getItem(id).checked;
				this.updateItem(id, {checked:!checked});
				//value is updated
				webix.message(JSON.stringify(this.getItem(id), null, 2));
			  }
          },
          on: {
            onItemClick: function (id) {
              //   remove(id);
            },
          },
        },
      ],
    },
  };
}

export class PlaylistForm extends JetView {
  config() {
    return WindowForm();
  }
  show(target) {
    this.getRoot().show(target);
  }
}

// https://forum.webix.com/t/is-there-a-way-to-add-switch-box-to-a-dataview/21315/2
// https://snippet.webix.com/0olv81fe
