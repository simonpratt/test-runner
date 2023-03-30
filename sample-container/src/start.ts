import environment from "./core/environment";
import axios from "axios";
import { argv } from "process";

console.log("Submitting", argv[2]);

const wait = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

const main = async () => {
  wait(5000);
};

main();

// axios.post(`${environment.RESULTS_API_URL}/result`, {
//   commandId: environment.COMMAND_ID,
//   status: 'SUCCESS',
// });
// axios.post("http://host.docker.internal:9000/discover");
