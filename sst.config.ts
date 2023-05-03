import { SSTConfig } from "sst";
import { ApiGatewayStack } from "./stacks/ApiGateway";

export default {
  config(_input) {
    return {
      name: "numeric-values-app",
      region: "eu-central-1",
      profile: 'mykolareheda',
    };
  },
  stacks(app) {
    app.stack(ApiGatewayStack);
  },
} satisfies SSTConfig;
