import TValue from './graphql/value.type';
import { handler as enterValue } from './enterValue';

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    value: TValue;
  };
};

export async function handler(event: AppSyncEvent) {
  switch (event.info.fieldName) {
    case 'enterValue':
      return await enterValue(event.arguments.value);
    default:
      return null;
  }
}
