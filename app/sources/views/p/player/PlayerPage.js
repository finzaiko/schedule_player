import { JetView } from "webix-jet";
import { defaultHeader } from "../../../helpers/api";
import { state, url } from "../../../models/Player";

const sockPrefix = "zko";

const mToolbar = {
  view: "toolbar",
  height: 50,
  cols: [
    {
      view: "label",
      label: "Player",
      width: 200,
      css: "title_lbl",
    },
    {},
    {
      view: "uploader",
      value: "<span class='webix_icon mdi mdi-plus'></span>",
      css: "sound_uploader_btn webix_icon_button",
      tooltip: "Add sound file",
      autowidth: true,
      id: "uploadAPI",
      accept: "audio/mp3",
      multiple: false,
      upload: `${url}/addsound`,
      on: {
        onAfterFileAdd: function (file) {
          webix.extend($$("player_list"), webix.ProgressBar);
          $$("player_list").showProgress({
            type: "top",
          });
        },
        onFileUpload: function (item) {
          webix.message({ text: "Done", type: "success" });
        },
        onUploadComplete: function (res) {
          $$("player_list").clearAll();
          $$("player_list").load(`${url}/sound`);
          $$("player_list").showProgress();
        },
        onFileUploadError: function (res) {
          const jsonData = JSON.parse(res.xhr.response);
          webix.message({
            text: "Upload failed: " + jsonData.message,
            type: "error",
          });
          setTimeout(() => {
            $$("player_list").hideProgress();
          }, 1000);
        },
      },
      link: "player_list",
      apiOnly: true,
    },
    {
      view: "icon",
      icon: "mdi mdi-playlist-music",
      tooltip: "Playlist",
      css: "playlist_icon",
      click: function () {
        this.$scope.show("/p.player.playlist");
      },
    },
    {
      view: "icon",
      icon: "mdi mdi-stop",
      css: "stop_sound",
      tooltip: "Stop all sound",
      click: function () {
        webix.ajax().headers(defaultHeader()).get(`${url}/stop`);
      },
    },
    { width: 10 },
  ],
};

const list = {
  view: "list",
  template: "#value#",
  id: "player_list",
  select: true,
  url: `${url}/sound`,
  onClick: {
    player_play: function (ev, id) {
      console.log("id", id);
      webix.message("Play sound " + id);
    },
  },
  on: {
    onItemClick: function (sel) {
      console.log("sel", sel);
      const item = this.getItem(sel);
      console.log("item", item);

      openPlay(item.path, item.id, item.type).show();
    },
  },
};

function openPlay(path, file, type) {
  return webix.ui({
    view: "window",
    position: "center",
    head: false,
    animate: { type: "flip", subtype: "vertical" },
    padding: 20,
    modal: true,
    body: {
      rows: [
        {
          cols: [
            {
              view: "button",
              type: "icon",
              icon: "mdi mdi-dots-vertical",
              autowidth: true,
              click: function () {
                console.log("path", path);
                if (type == "s") {
                  $$("player_playlist").hide();
                } else {
                  $$("player_playlist").show();
                }
                $$("player_rename").show();
                $$("player_delete").show();
              },
            },
            {
              view: "button",
              type: "icon",
              icon: "mdi mdi-play",
              width: 100,
              tooltip: "Play selected",
              click: function () {
                const inputData = {
                  path,
                  file,
                  type,
                  loop: $$("player_looptime").getValue(),
                };
                webix
                  .ajax()
                  .headers(defaultHeader())
                  .post(`${url}/play`, inputData)
                  .then((r) => {
                    this.getParentView()
                      .getParentView()
                      .getParentView()
                      .close();
                  });
              },
            },
            {
              view: "text",
              width: 100,
              type: "number",
              id: "player_looptime",
              value: "1",
              attributes: { min: 1, max: 10000 },
            },
            {
              view: "button",
              type: "icon",
              icon: "mdi mdi-close",
              tooltip: "Close",
              autowidth: true,
              click: function () {
                this.getParentView().getParentView().getParentView().close();
              },
            },
          ],
        },
        {
          view: "button",
          value: "Show playlist",
          id: "player_playlist",
          hidden: true,
          click: function () {
            openPlaylist(file);
          },
        },
        {
          view: "text",
          id: "player_rename_input",
          placeholder: "Rename to..",
          hidden: true,
        },
        {
          view: "button",
          id: "player_rename",
          value: "Rename",
          hidden: true,
          click: function () {
            this.hide();
            $$("player_rename_input").show();
            $$("player_rename_confirm").show();
            $$("player_playlist").hide();
            $$("player_delete").hide();
            var newResult = file.substring(0, file.lastIndexOf("."));
            console.log("newResult", newResult);
            $$("player_rename_input").setValue(newResult);
          },
        },
        {
          view: "button",
          id: "player_rename_confirm",
          value: "Confirm Rename",
          hidden: true,
          click: function () {
            $$("player_rename_input").show();
            $$("player_playlist").hide();
            $$("player_delete").hide();
            const _this = this.getParentView().getParentView();
            const inputData = {
              path,
              file,
              new_name: $$("player_rename_input").getValue(),
            };

            webix
              .ajax()
              .headers(defaultHeader())
              .post(`${url}/rename`, inputData)
              .then((r) => {
                console.log("r", r);
                $$("player_list").clearAll();
                $$("player_list").load(`${url}/sound`);
                _this.close();
              });
          },
        },
        {
          view: "button",
          id: "player_delete",
          value: "Delete",
          hidden: true,
          click: function () {
            const inputData = {
              path,
              file,
              type,
            };
            const _this = this.getParentView().getParentView();
            webix.confirm({
              ok: "Yes",
              cancel: "No",
              type: "confirm-error",
              text: `Are you sure delete: ${file} ?`,
              callback: function (result) {
                if (result) {
                  webix
                    .ajax()
                    .headers(defaultHeader())
                    .post(`${url}/remove`, inputData)
                    .then((r) => {
                      console.log("r", r);
                      $$("player_list").clearAll();
                      $$("player_list").load(url);
                      _this.close();
                    });
                }
              },
            });
          },
        },
      ],
    },
    on: {
      onShow: function () {
        console.log("onshow");
      },
    },
  });
}

function openPlaylist(playlistName) {
  playlistName = playlistName.substring(0, playlistName.lastIndexOf("."));

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
          {},
          { view: "label", label: "Playlist File", align: "center" },
          {},
          {
            view: "icon",
            icon: "mdi mdi-close",
            tooltip: "Close",
            align: "right",
            click: function () {
              $$("win3").close();
            },
          },
        ],
      },
      body: {
        rows: [
          {
            view: "list",
            id: "playlist_show_list",
            template: "#file#",
            select: true,
          },
        ],
      },
      on: {
        onShow: function () {
          $$("playlist_show_list").clearAll();
          $$("playlist_show_list").load(
            `${url}/playlist_detail?file=${playlistName}&checked=true`
          );
        },
      },
    })
    .show();
}

export class PlayerPageMobile extends JetView {
  config() {
    return {
      rows: [mToolbar, list],
    };
  }
  init(v) {
    $$("uploadAPI").addDropZone($$("player_list").$view, "Drop files here");
  }
}
