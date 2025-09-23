import log from "loglevel";


log.setLevel("info");

if (import.meta.env.MODE === "development") {
  log.setLevel("debug");
}

export default log;
