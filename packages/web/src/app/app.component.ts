import { Component, OnDestroy, OnInit } from '@angular/core';
import { ZenObservable } from 'zen-observable-ts';

import { __SubscriptionContainer, APIService, SubscriptionResponse } from './API.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnInit, OnDestroy {
  public history: any[] = [];
  public inputValue: number | null = null;

  public currentData: { value: string, time: string } | null = null;
  private currentDataSubscription: ZenObservable.Subscription;

  constructor(private readonly api: APIService) {}

  public ngOnInit(): void {
    this.currentDataSubscription = this.api.OnEnteredValueListener
    .subscribe({
      next: (value: SubscriptionResponse<Pick<__SubscriptionContainer, "onEnteredValue">>) => {
        this.currentData = {
          value: value.value.data?.onEnteredValue.measure_value!,
          time: new Date(+value.value.data?.onEnteredValue.time!).toLocaleString(),
        };
      },
      error: (error) => console.error(error.message),
    });
  }

  public enterValue(): void {
    this.api.EnterValue({
      dimension: 'test',
      measure_value: this.inputValue!.toString(),
      measure_name: 'value',
    }).then(() => console.log('Success!'))
    .catch((error) => console.error(error.message));
  }

  public getHistory(): void {
    this.api.getHistory().subscribe({
      next: (response: any) => {
        for (const property in response) {
          if (property !== "headers" && property !== "cookies") {
            this.history.push({
              value: response[property].Data[3].ScalarValue,
              time: new Date(response[property].Data[2].ScalarValue).toLocaleString(),
            });
          }
        }
      },
      error: (error) => console.error('---ERROR---', error.message),
    });
  }

  public ngOnDestroy(): void {
    if (this.currentDataSubscription)
      this.currentDataSubscription.unsubscribe();
  }
}
