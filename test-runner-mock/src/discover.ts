import environment from "./core/environment";
import axios from "axios";

console.log("discovering");

axios.post(`${environment.DISCOVERY_POST_URL}`, {
  tests: ["a.test.ts", "b.test.ts", "c.test.ts"],
});
// axios.post("http://host.docker.internal:9000/discover");
