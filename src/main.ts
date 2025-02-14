import { createApp } from "vue";
import App from "./App.vue";
import "./assets/style/main.css";
import "lu2/theme/edge/css/common/ui/Button.css";
import "lu2/theme/edge/css/common/ui/Input.css";
import "lu2/theme/edge/css/common/ui/LightTip.css";
import "lu2/theme/edge/css/common/ui/Dialog.css";
import "lu2/theme/edge/css/common/ui/Checkbox.css";
import "lu2/theme/edge/css/common/ui/Color.css";
import "lu2/theme/edge/js/common/ui/LightTip.js";

interface Clarity {
  init: (projectId: string) => void;
}

interface ClarityModule {
  default: Clarity;
}

const clarityEnable = import.meta.env.VITE_CLARITY_ENABLE;
const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID;

if (clarityEnable && clarityProjectId) {
  import("@microsoft/clarity").then((Module: ClarityModule) => {
    Module.default.init(clarityProjectId);
  });
}

createApp(App).mount("#app");
