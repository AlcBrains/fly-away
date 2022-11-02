import { Component, OnInit } from '@angular/core';
import { interval, mergeMap, Subscription } from 'rxjs';
import { ElectronService } from '../core/services/electron/electron.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  subscription: Subscription;

  constructor(private electronService: ElectronService) { }

  ngOnInit(): void {
    this.subscription = interval(10000).pipe(mergeMap(() => this.electronService.getArrivals()))
    .subscribe(data => { console.log(data) });
  }

}
