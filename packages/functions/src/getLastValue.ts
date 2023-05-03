import { ApiHandler } from "sst/node/api";
import AWS from 'aws-sdk';

import { constants } from './constants/constants';

const queryClient = new AWS.TimestreamQuery({
  region: 'eu-central-1',
  accessKeyId: constants.ACCESS_KEY_ID,
  secretAccessKey: constants.SECRET_ACCESS_KEY,
})

export const handler = ApiHandler(async (_evt) => {
  const params = {
    QueryString: 'SELECT * FROM "numericvalues"."values" ORDER BY "time" DESC LIMIT 1',
  };

  let queryResponse;
  await queryClient.query(params).promise()
  .then((response) => {
    queryResponse = JSON.stringify(response.Rows[0].Data);
    console.log('Success!');
  })
  .catch((error) => console.error('Error while querying', error));

  return {
    measure_value: JSON.parse(queryResponse)[3].ScalarValue,
    time: new Date(JSON.parse(queryResponse)[2].ScalarValue).toLocaleString(),
  };
});
