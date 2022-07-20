import { API_URL, CODE_PREFIX } from "../config/setting";

const path = "player";

export let state = {
  prefix: CODE_PREFIX + path,
  isEdit: false,
  dataSelected: {},
  id: 0,
  isPlayerShow: false
};

export let url = API_URL + "/" + path;
