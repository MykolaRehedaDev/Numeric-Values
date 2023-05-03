import { Component, OnDestroy, OnInit } from '@angular/core';
import { ZenObservable } from 'zen-observable-ts';

import { __SubscriptionContainer, APIService, SubscriptionResponse } from './API.service';
import { BehaviorSubject } from 'rxjs';

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

  public loadingHistory$ = new BehaviorSubject<boolean>(false);
  public loadingCurrentValue$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly api: APIService) {}

  public ngOnInit(): void {
    this.api.getLastValue().subscribe({
      next: (value) => this.currentData = { value: value.measure_value, time: value.time },
    });
    this.currentDataSubscription = this.api.OnEnteredValueListener
    .subscribe({
      next: (value: SubscriptionResponse<Pick<__SubscriptionContainer, "onEnteredValue">>) => {
        this.currentData = {
          value: value.value.data?.onEnteredValue.measure_value!,
          time: new Date(+value.value.data?.onEnteredValue.time!).toLocaleString(),
        };
        if (this.history.length)
          this.getHistory();
      },
      error: (error) => console.error(error.message),
    });
  }

  public enterValue(): void {
    this.loadingCurrentValue$.next(true);
    this.api.EnterValue({
      dimension: 'test',
      measure_value: this.inputValue!.toString(),
      measure_name: 'value',
    }).then(() => console.log('Success!'))
    .catch((error) => console.error(error.message))
    .finally(() => this.loadingCurrentValue$.next(false));
  }

  public getHistory(): void {
    this.loadingHistory$.next(true);
    this.history = [];
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
        this.loadingHistory$.next(false);
      },
      error: (error) => {
        console.error('---ERROR---', error.message);
        this.loadingHistory$.next(false);
      },
    });
  }

  public ngOnDestroy(): void {
    if (this.currentDataSubscription)
      this.currentDataSubscription.unsubscribe();
  }
}
