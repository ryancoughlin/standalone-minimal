import { createApp } from "vue";
import { createPinia } from "pinia";
import { MotionPlugin } from "@vueuse/motion";
import DemoLibrary from "./components/DemoLibrary.vue";
import "./style.css";

const app = createApp(DemoLibrary);
const pinia = createPinia();

app.use(pinia);
app.use(MotionPlugin);
app.mount("#app");
