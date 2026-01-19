// baremux.js - client-side BareMux initializer
export async function initBareMux() {
  if (!window.BareMux) {
    console.error("BareMux not loaded!");
    return false;
  }

  try {
    const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
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
