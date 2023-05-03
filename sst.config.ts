import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "numeric-values-app",
      region: "eu-central-1",
      profile: 'mykolareheda',
    };
  },
  stacks(app) {
    app.stack(API);
  },
} satisfies SSTConfig;
