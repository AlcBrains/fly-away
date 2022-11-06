import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { mergeMap, Subscription, timer } from 'rxjs';
import { ElectronService } from '../core/services/electron/electron.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('arrivalsPaginator') arrivalsPaginator: MatPaginator;
  @ViewChild('departuresPaginator') departuresPaginator: MatPaginator;

  subscription = new Subscription();
  arrivals: MatTableDataSource<any>;
  departures: MatTableDataSource<any>;
  public departuresDisplayedColumns: string[] = ['fnr', 'destination', 'sched', 'schalter', 'terminal', 'gate', 'status']
  public arrivalsDisplayedColumns: string[] = ['airline', 'fnr', 'codeshare', 'apname', 'sched', 'terminal', 'status']

  constructor(private electronService: ElectronService) {
    this.arrivals = new MatTableDataSource<any>([]);
    this.departures = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.subscription.add(timer(0, 5 * 300000).pipe(mergeMap(() => this.electronService.getArrivals()))
      .subscribe(data => {
        const tmp = JSON.parse(data);
        tmp.forEach(element => {
          if (element.status.includes('&nbsp;')) {
            element.status = ''
          }
        });
        this.arrivals.data = tmp
      }));

    this.subscription.add(timer(500, 300000).pipe(mergeMap(() => this.electronService.getDepartures()))
      .subscribe(data => {
        const tmp = JSON.parse(data);
        tmp.forEach(element => {
          if (element.status.includes('&nbsp;')) {
            element.status = ''
          }
        });
        this.departures.data = tmp

      }));

  }

  ngAfterViewInit(): void {
    this.arrivals.paginator = this.arrivalsPaginator;
    this.departures.paginator = this.departuresPaginator;
    [this.arrivalsPaginator, this.departuresPaginator].forEach((paginator) => {
      setInterval(() => this.changePage(paginator), 20000)
    })
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

}
