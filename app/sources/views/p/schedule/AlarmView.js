import { JetView } from "webix-jet";
import { SOCKET_URL } from "../../../config/setting";
import { io } from "socket.io-client";
import { state, url } from "../../../models/Alarm";

const sockPrefix = "zko";

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
        state.isEdit = false;
        state.dataSelected = {};
        this.$scope.show("/p.schedule");
      },
    },
    {
      view: "label",
      label: "View Schedule Alarm",
      width: 200,
      id: "title_lbl",
      css: "title_lbl",
    },
    {},
  ],
};

const view = {
  view: "form",
  id: "view",
  elements: [
    {
      view: "text",
      label: "Title",
      readonly: true,
      name: "title",
    },
    {
      view: "text",
      label: "Repeat",
      readonly: true,
      name: "repeat",
      id: "view_repeat",
    },
    {
      view: "text",
      label: "Event at",
      readonly: true,
      name: "event_at",
    },
    {
      view: "text",
      label: "Sound",
      readonly: true,
      name: "sound",
    },
    {
      cols: [
        {
          view: "button",
          label: "Edit",
          autowidth: true,
          css: "webix_primary",
          click: function () {
            state.isEdit = true;
            this.$scope.show(`/p.schedule.edit?id=${state.dataSelected.id}`);
          }
        },
        {
          view: "button",
          label: "Delete",
          autowidth: true,
          css: "webix_danger",
          click: function(){
            removeAlarm(state.dataSelected,this.$scope);
          }
        },
      ],
    },
  ],
};


function removeAlarm(dataSel,_this){
  
  webix.confirm({
    ok: "Yes",
    cancel: "No",
    text:
     `Are you sure: ${dataSel.title} ?`,
    callback: function (result) {
      if (result) {
        webix.ajax().del(`${url}/${dataSel.id}`, null, function (res) {
          webix.message({text: `${dataSel.title} deleted.`, type: "error"});
          state.isEdit = false;
          state.dataSelected = {};
          _this.show("/p.schedule");
        });
      }
    }
  });
  
}

export class AlarmViewMobile extends JetView {
  config() {
    return {
      rows: [mToolbar, view],
    };
  }

  urlChange(view, url) {
    console.log("url", url);
    if(url[0].params.id && typeof state.dataSelected.id !="undefined"){
      console.log('url.length', url[0].params.id);
      console.log('state.dataSelected',state.dataSelected);
      $$("view").setValues(state.dataSelected);
      $$("view_repeat").setValue(this.getRepeatLabel(state.dataSelected.repeat));
    }else{
      state.isEdit = false;
      state.dataSelected = {};
      this.show("/p.schedule")
    }
  }

  ready(){
    const socket = io(SOCKET_URL);
    socket.on(`${sockPrefix}rm`, (data) => {
      console.log("LIST-RM>>", data);
      if(data==state.dataSelected.id){
        this.show("/p.schedule")
      }
    });
  }


  getRepeatLabel(stateRepeat){
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
        return "no"
    }
  }
}
