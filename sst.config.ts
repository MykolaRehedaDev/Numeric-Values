import { SSTConfig } from "sst";
import { ApiGatewayStack } from "./stacks/ApiGateway";
import { AppSyncStack } from './stacks/AppSyncApi';

export default {
  config(_input) {
    return {
      name: "numeric-values-app",
      region: "eu-central-1",
      profile: 'mykolareheda',
    };
  },
  stacks(app) {
    app
    .stack(ApiGatewayStack)
    .stack(AppSyncStack);
  },
} satisfies SSTConfig;
