import environment from "./core/environment";
import axios from "axios";
import { argv } from "process";

console.log("Submitting", argv[2]);

// axios.post(`${environment.RESULTS_API_URL}/result`, {
//   commandId: environment.COMMAND_ID,
//   status: 'SUCCESS',
// });
// axios.post("http://host.docker.internal:9000/discover");
