import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SalesChartComponent } from './sales-chart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SalesChartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-app');
}
