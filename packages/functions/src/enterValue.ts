import { ApiHandler } from 'sst/node/api';
import AWS from 'aws-sdk';
import * as https from 'https';

import { constants } from './constants/constants';

const agent = new https.Agent({
  maxSockets: 5000,
});

const writeClient = new AWS.TimestreamWrite({
  maxRetries: 10,
  httpOptions: {
    timeout: 20000,
    agent: agent,
  },
  region: 'eu-central-1',
  accessKeyId: constants.ACCESS_KEY_ID,
  secretAccessKey: constants.SECRET_ACCESS_KEY,
});

export const handler = ApiHandler(async (_evt: any) => {
  console.log('Writing records...');
  const currentTime = Date.now().toString();

  const value = {
    Dimensions: [{
      Name: 'dimension',
      Value: `${_evt.dimension}`,
      DimensionValueType: 'VARCHAR',
    }],
    MeasureName: `${_evt.measure_name}`,
    MeasureValue: `${_evt.measure_value}`,
    MeasureValueType: "VARCHAR",
    Time: currentTime,
  };
  const params = {
    DatabaseName: 'numericvalues',
    TableName: 'values',
    Records: [value],
  }

  const request: any = writeClient.writeRecords(params);

  await request.promise()
    .then(() => console.log('Write records successful'))
    .catch((error: any) => {
      console.error('Error writing records', error);
      if (error.code === 'RejectedRecordsException') {
        const responsePayload = JSON.parse(request.response.httpResponse.body.toString());
        console.log("RejectedRecords: ", responsePayload.RejectedRecords);
        console.log("Other records were written successfully. ");
      }
    });

  return { ..._evt, time: currentTime };
});
