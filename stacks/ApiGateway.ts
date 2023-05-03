import { StackContext, Api as ApiGateway } from "sst/constructs";

export function ApiGatewayStack({ stack }: StackContext) {
  const apiGateway = new ApiGateway(stack, "ApiGateway", {
    routes: {
      "GET /history": "packages/functions/src/history.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: apiGateway.url,
  });
}
