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
    QueryString: 'SELECT * FROM "numericvalues"."values" ORDER BY "time" DESC',
  };

  let queryResponse;
  await queryClient.query(params).promise()
  .then((response) => {
    queryResponse = JSON.stringify(response);
    console.log('Success!');
  })
  .catch((error) => console.error('Error while querying', error));

  return JSON.parse(queryResponse).Rows;
});
