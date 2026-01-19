// baremux.js - client-side BareMux initializer
import { BareMuxConnection } from '/baremux/index.js';

export async function initBareMux() {
  try {
    const connection = new BareMuxConnection("/baremux/worker.js");
    const wispUrl =
      (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";

    if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
      await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
    }

    console.log("BareMux initialized!");
    return true;
  } catch (err) {
    console.error("BareMux init failed:", err);
    return false;
  }
}
