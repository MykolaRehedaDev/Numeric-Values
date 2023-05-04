# Numeric Values

This project was generated with SST Framework.

## Stacks

### ApiGateawy 

ApiGateway used to process requests to retrieve data from Timestream db. (History of values, Last value) 

### AppSync 

AppSync used to synchronize data between clients and push new entered data.

`GET` requests are handled by functions that are in the `history.ts` and `getLastValue.ts` files, which are placed in the `functions` directory.

Last value handler
```javascript
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
```

History handler
```javascript
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
```

The `enterValue` function is responsible for writing a new value to the database and returning it to the client. The `main.ts` function processes requests to AppSync and distributes them among the functions. 

Enter value handler
```javascript
export const handler = ApiHandler(async (_evt) => {
  console.log('Writing records...');
  const currentTime = Date.now().toString();

  const value = {
    Dimensions: [ {
      Name: 'dimension',
      Value: `${ _evt.dimension }`,
      DimensionValueType: 'VARCHAR',
    } ],
    MeasureName: `${ _evt.measure_name }`,
    MeasureValue: `${ _evt.measure_value }`,
    MeasureValueType: "VARCHAR",
    Time: currentTime,
  };
  const params = {
    DatabaseName: 'numericvalues',
    TableName: 'values',
    Records: [ value ],
  }

  const request = writeClient.writeRecords(params);

  await request.promise()
  .then(() => console.log('Write records successful'))
  .catch((error) => {
    console.error('Error writing records', error);
    if (error.code === 'RejectedRecordsException') {
      const responsePayload = JSON.parse(request.response.httpResponse.body.toString());
      console.log("RejectedRecords: ", responsePayload.RejectedRecords);
      console.log("Other records were written successfully. ");
    }
  });

  return { ..._evt, time: currentTime };
});
```

The `graphql` directory stores the schema and type for the value.

```
type Value {
    dimension: String!
    measure_name: String!
    measure_value: String!
    time: String
}

input ValueInput {
    dimension: String!
    measure_name: String!
    measure_value: String!
}

type Query {
    listValues: [Value]
}

type Mutation {
    enterValue(value: ValueInput!): Value
}

type Subscription {
    onEnteredValue: Value @aws_subscribe(mutations: ["enterValue"])
}
```

The UI is implemented using Angular. Amplify is used to interact with AppSync.
It is implemented to get the history of records, get the last value, as well as entering a new value from the UI and subscribe to this event for data synchronization.
