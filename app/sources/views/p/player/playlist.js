import { JetView } from "webix-jet";
import { defaultHeader } from "../../../helpers/api";
import { state, url } from "../../../models/Player";

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
          this.$scope.show(`/p.player.view?id=${state.dataSelected.id}`);
        } else {
          this.$scope.show("/p.player");
        }
      },
    },
    {
      view: "label",
      label: "Playlist",
      width: 200,
      id: "title_lbl",
      css: "title_lbl",
    },
    {},
    {
      view: "icon",
      icon: "mdi mdi-plus",
      css: "playlist_add_icon",
      autowidth: true,
      click: function () {
        openPlaylistDetail();
      },
    },
    { width: 10 },
  ],
};

const list = {
  view: "list",
  id: "play_list",
  template: "#file#",
  select: true,
  // url: `${url}/playlist_sound`,
  url: `${url}/playlist`,
  on: {
    onItemClick: function (id) {
      const item = this.getItem(id);
      openPlaylistDetail(item.file);
    },
  },
};

function openPlaylistDetail(playlistFile) {
  let newResult = "";
  if (typeof playlistFile != "undefined") {
    newResult = playlistFile.substring(0, playlistFile.lastIndexOf("."));
  }
  webix
    .ui({
      view: "window",
      position: "center",
      id: "win3",
      height: window.innerHeight - 40,
      width: window.innerWidth - 200,
      head: {
        view: "toolbar",
        cols: [
          {
            view: "icon",
            type: "icon",
            icon: "mdi mdi-delete-outline",
            id: "playlist_delete_icon",
            css: "playlist_delete_icon",
            tooltip: "Delete this Playlist",
            autowidth: true,
            hidden: true,
            click: function () {
              const inputData = {
                // file : newResult+".txt",
                file: $$("playlist_name").getValue(),
                type: "p",
              };
              webix.confirm({
                ok: "Yes",
                cancel: "No",
                type: "confirm-error",
                text: `Are you sure delete: ${inputData.file} ?`,
                callback: function (result) {
                  if (result) {
                    webix
                      .ajax()
                      .headers(defaultHeader())
                      .post(`${url}/remove`, inputData)
                      .then((r) => {
                        console.log("r", r);
                        $$("play_list").clearAll();
                        $$("play_list").load(`${url}/playlist_sound`);
                        $$("win3").close();
                        // setTimeout(() => {
                        // }, 800);
                      });
                  }
                },
              });
            },
          },
          {},
          { view: "label", label: "Manage Playlist", align: "center" },
          {},
          {
            view: "icon",
            icon: "mdi mdi-close",
            tooltip: "Close",
            align: "right",
            click: function () {
              $$("play_list").clearAll();
              // $$("play_list").load(`${url}/playlist_sound`);
              $$("play_list").load(`${url}/playlist`);
              $$("win3").close();
            },
          },
        ],
      },
      body: {
        rows: [
          {
            padding: 10,
            view: "form",
            type: "clean",
            id: "playlist_form",
            elements: [
              {
                cols: [
                  {
                    view: "text",
                    borderless: true,
                    placeholder: "Playlist name..",
                    css: "playlist_name_input",
                    name: "playlist_name",
                    id: "playlist_name",
                    on: {
                      onEnter: function (ev) {
                        const playlist = $$("playlist_name").getValue();
                        const newName = playlist.replace(/[^A-Z0-9]/gi, "_");

                        $$("playlist_detail_list").clearAll();
                        $$("playlist_detail_list").load(
                          `${url}/playlist_detail?file=${newName.toLowerCase()}`
                        );
                      },
                    },
                  },
                ],
              },
            ],
            rules: {
              playlist_name: webix.rules.isNotEmpty,
            },
            on: {
              onAfterValidation: function (result, value) {
                if (!result) {
                  var text = [];
                  for (var key in value) {
                    if (key == "playlist_name") {
                      text.push("Playlist Name can not empty");
                    }
                    webix.message({ type: "error", text: text.join("<br>") });
                  }
                }
              },
            },
          },
          {
            view: "list",
            id: "playlist_detail_list",
            template: function (obj) {
              let html = `${
                obj.file
              }<span class='webix_icon switcher remove-icon mdi mdi-${
                obj.checked ? "check" : ""
              }'></span>`;
              return html;
            },
            select: true,
            on: {
              onItemClick: function (id) {
                if ($$("playlist_form").validate()) {
                  $$("playlist_delete_icon").show();

                  const item = this.getItem(id);
                  const inputData = {
                    playlist: $$("playlist_name").getValue(),
                    path: item.path,
                    file: item.file,
                  };
                  webix
                    .ajax()
                    .headers(defaultHeader())
                    .post(`${url}/playlist_add`, inputData)
                    .then((r) => {
                      const playlist = $$("playlist_name").getValue();
                      const newName = playlist.replace(/[^A-Z0-9]/gi, "_");
                      $$("playlist_detail_list").clearAll();
                      $$("playlist_detail_list").load(
                        `${url}/playlist_detail?file=${newName.toLowerCase()}`
                      );
                    });
                }
              },
            },
          },
        ],
      },
      on: {
        onShow: function () {
          if (newResult != "") {
            $$("playlist_name").setValue(newResult);
          }
          const playlist = $$("playlist_name").getValue();
          const newName = playlist.replace(/[^A-Z0-9]/gi, "_");

          if (playlist) {
            $$("playlist_delete_icon").show();
          }
          $$("playlist_detail_list").clearAll();
          $$("playlist_detail_list").load(
            `${url}/playlist_detail?file=${newName.toLowerCase()}`
          );
        },
      },
    })
    .show();
}
export default class PlaylistPage extends JetView {
  config() {
    return {
      rows: [mToolbar, list],
    };
  }
  init(view) {}
}
