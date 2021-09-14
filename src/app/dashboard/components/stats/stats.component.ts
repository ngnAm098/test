import { Component, Input, OnInit } from '@angular/core';
import { StatData } from '@app/dashboard/models/stat-data';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  @Input() underCorpus: StatData;
  @Input() ongoing: StatData;
  @Input() appealed: StatData;
  @Input() closed: StatData;

  constructor() {}

  ngOnInit(): void {}
}
