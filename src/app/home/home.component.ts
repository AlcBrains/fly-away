import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  map,
  mergeMap,
  Observable,
  shareReplay,
  Subscription,
  take,
  timer
} from 'rxjs';
import { ElectronService } from '../core/services/electron/electron.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('arrivalsPaginator') arrivalsPaginator: MatPaginator;
  @ViewChild('departuresPaginator') departuresPaginator: MatPaginator;

  public PAGE_SIZE = 18;
  public arrivals: MatTableDataSource<any>;
  public departures: MatTableDataSource<any>;
  private airlineLogos: any[];
  private _time$: Observable<Date>;
  private subscription = new Subscription();
  public departuresDisplayedColumns: string[] = [
    'airline',
    'fnr',
    'destination',
    'sched',
    'schalter',
    'terminal',
    'gate',
    'status',
  ];
  public arrivalsDisplayedColumns: string[] = [
    'airline',
    'fnr',
    'codeshare',
    'apname',
    'sched',
    'terminal',
    'status',
  ];

  constructor(private electronService: ElectronService) {
    this.arrivals = new MatTableDataSource<any>([]);
    this.departures = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.electronService
      .getAirlineLogos()
      .pipe(take(1))
      .subscribe((res) => {
        this.airlineLogos = JSON.parse(res);
      });

    this.subscription.add(
      timer(0, 5 * 300000)
        .pipe(mergeMap(() => this.electronService.getDepartures()))
        .subscribe((data) => {
          const tmp = this.transformFlightInfo(JSON.parse(data));
          this.departures.data = tmp;
        })
    );

    this.subscription.add(
      timer(0, 5 * 300000)
        .pipe(mergeMap(() => this.electronService.getArrivals()))
        .subscribe((data) => {
          const tmp = this.transformFlightInfo(JSON.parse(data));
          this.arrivals.data = tmp;
        })
    );

    this._time$ = timer(0, 1000).pipe(
      map((tick) => new Date()),
      shareReplay(1)
    );
  }

  get time() {
    return this._time$;
  }

  ngAfterViewInit(): void {
    this.arrivals.paginator = this.arrivalsPaginator;
    this.departures.paginator = this.departuresPaginator;
    [this.arrivalsPaginator, this.departuresPaginator].forEach((paginator) => {
      setInterval(() => this.changePage(paginator), 15000);
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public changePage(paginator) {
    if (paginator.hasNextPage()) {
      paginator.nextPage();
    } else {
      paginator.firstPage();
    }
  }

  private transformFlightInfo(tmp) {
    tmp.forEach((element) => {
      if (element.status.includes('&nbsp;')) {
        element.status = '';
      }
      for (let airline of this.airlineLogos) {
        if (element.alname.toLowerCase().includes(airline.split('.')[0])) {
          element['image'] = 'assets/icons/airlines/' + airline;
          break;
        }
      }
    });
    while (tmp.length % this.PAGE_SIZE != 0) {
      tmp.push({ image: 'assets/icons/airlines/blank.png' });
    }
    return tmp;
  }
}
