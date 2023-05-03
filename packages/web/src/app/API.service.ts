/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";
import { Observable as RxJsObservable, take } from 'rxjs';

export interface SubscriptionResponse<T> {
  value: GraphQLResult<T>;
}

export type __SubscriptionContainer = {
  onEnteredValue: OnEnteredValueSubscription;
};

export type ValueInput = {
  dimension: string;
  measure_name: string;
  measure_value: string;
};

export type Value = {
  __typename: "Value";
  dimension: string;
  measure_name: string;
  measure_value: string;
  time?: string | null;
};

export type EnterValueMutation = {
  __typename: "Value";
  dimension: string;
  measure_name: string;
  measure_value: string;
  time?: string | null;
};

export type ListValuesQuery = {
  __typename: "Value";
  dimension: string;
  measure_name: string;
  measure_value: string;
  time?: string | null;
};

export type OnEnteredValueSubscription = {
  __typename: "Value";
  dimension: string;
  measure_name: string;
  measure_value: string;
  time?: string | null;
};

@Injectable({
  providedIn: "root",
})
export class APIService {
  private _baseUrl = 'https://cj9vcp768f.execute-api.eu-central-1.amazonaws.com';

  constructor(private http: HttpClient) {}

  async EnterValue(value: ValueInput): Promise<EnterValueMutation> {
    const statement = `mutation EnterValue($value: ValueInput!) {
        enterValue(value: $value) {
          __typename
          dimension
          measure_name
          measure_value
          time
        }
      }`;
    const gqlAPIServiceArguments: any = {
      value,
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments),
    )) as any;
    return <EnterValueMutation>response.data.enterValue;
  }

  async ListValues(): Promise<Array<ListValuesQuery>> {
    const statement = `query ListValues {
        listValues {
          __typename
          dimension
          measure_name
          measure_value
          time
        }
      }`;
    const response = (await API.graphql(graphqlOperation(statement))) as any;
    return <Array<ListValuesQuery>>response.data.listValues;
  }

  OnEnteredValueListener: Observable<SubscriptionResponse<Pick<__SubscriptionContainer, "onEnteredValue">>> = API.graphql(
    graphqlOperation(
      `subscription OnEnteredValue {
        onEnteredValue {
          __typename
          dimension
          measure_name
          measure_value
          time
        }
      }`,
    ),
  ) as Observable<SubscriptionResponse<Pick<__SubscriptionContainer, "onEnteredValue">>>;

  public getHistory(): RxJsObservable<any> {
    return this.http.get(this._baseUrl + '/history')
    .pipe(take(1));
  }

  public getLastValue(): RxJsObservable<any> {
    return this.http.get(this._baseUrl + '/last')
    .pipe(take(1));
  }
}
