import { StackContext, AppSyncApi } from 'sst/constructs';

export function AppSyncStack({ stack }: StackContext) {
  const appSync = new AppSyncApi(stack, 'AppSync', {
    schema: 'packages/functions/src/graphql/schema.graphql',
    dataSources: {
      main: 'packages/functions/src/main.handler',
    },
    resolvers: {
      'Mutation enterValue': 'main',
    },
  });

  stack.addOutputs({
    ApiId: appSync.apiId,
    ApiUrl: appSync.url,
    ApiKey: appSync.cdk.graphqlApi.apiKey,
  });
}
