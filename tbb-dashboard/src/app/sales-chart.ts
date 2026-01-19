import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SalesData {
  day: string;
  sales: number;
}

@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sales-chart-container">
      <div class="chart-wrapper">
        <svg [attr.viewBox]="'0 0 ' + chartWidth + ' ' + chartHeight" class="chart-svg">
          <defs>
            <linearGradient id="sales-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#FF41F8;stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:#7B61FF;stop-opacity:0.05" />
            </linearGradient>
          </defs>

          <!-- Grid lines -->
          @for (i of [0, 1, 2, 3, 4]; let index = $index; track index) {
            <line
              [attr.x1]="margin"
              [attr.y1]="margin + (index * (chartHeight - 2 * margin)) / 4"
              [attr.x2]="chartWidth - margin"
              [attr.y2]="margin + (index * (chartHeight - 2 * margin)) / 4"
              class="grid-line"
            />
          }

          <!-- Y-axis -->
          <line
            [attr.x1]="margin"
            [attr.y1]="margin"
            [attr.x2]="margin"
            [attr.y2]="chartHeight - margin"
            class="axis"
          />

          <!-- X-axis -->
          <line
            [attr.x1]="margin"
            [attr.y1]="chartHeight - margin"
            [attr.x2]="chartWidth - margin"
            [attr.y2]="chartHeight - margin"
            class="axis"
          />

          <!-- Area under curve -->
          <defs>
            <path
              [attr.d]="getAreaPath()"
              fill="url(#sales-gradient)"
              class="area"
            />
          </defs>

          <!-- Line path -->
          <polyline
            [attr.points]="getLinePoints()"
            class="line"
          />

          <!-- Data points -->
          @for (item of chartData; let i = $index; track item.day) {
            <g>
              <circle
                [attr.cx]="getX(i)"
                [attr.cy]="getY(item.sales)"
                r="4"
                class="data-point"
              />
              <text
                [attr.x]="getX(i)"
                [attr.y]="chartHeight - margin + 25"
                class="bar-label"
              >
                {{ item.day }}
              </text>
            </g>
          }
        </svg>
      </div>
      <div class="chart-legend">
        <p>Daily sales revenue</p>
      </div>
    </div>
  `,
  styles: [
    `
      .sales-chart-container {
        width: 100%;
        padding: 0;
      }

      .chart-wrapper {
        width: 100%;
        aspect-ratio: 16 / 9;
      }

      .chart-svg {
        width: 100%;
        height: 100%;
      }

      .grid-line {
        stroke: rgba(119, 2, 255, 0.08);
        stroke-width: 1;
      }

      .axis {
        stroke: var(--gray-400, #b3b3b7);
        stroke-width: 2;
      }

      .area {
        pointer-events: none;
      }

      .line {
        fill: none;
        stroke: var(--electric-violet, #7B61FF);
        stroke-width: 3;
        pointer-events: none;
      }

      .data-point {
        fill: var(--vivid-pink, #FF41F8);
        stroke: white;
        stroke-width: 2;
        cursor: pointer;
        transition: r 0.2s ease;
      }

      .data-point:hover {
        r: 6;
      }

      .bar-label {
        font-size: 12px;
        fill: var(--gray-700, #5f5f66);
        text-anchor: middle;
        font-weight: 500;
      }

      .chart-legend {
        text-align: center;
        color: var(--gray-700, #5f5f66);
        font-size: 0.875rem;
        padding: 1rem 0 0 0;
      }

      .chart-legend p {
        margin: 0;
      }

      @media (max-width: 650px) {
        .chart-wrapper {
          aspect-ratio: 4 / 3;
        }

        .bar-label {
          font-size: 10px;
        }

        .line {
          stroke-width: 2;
        }

        .data-point {
          r: 3;
        }
      }
    `,
  ],
})
export class SalesChartComponent {
  @Input() data: any[] = [];

  chartWidth = 800;
  chartHeight = 400;
  margin = 50;

  get chartData(): SalesData[] {
    if (!this.data || this.data.length === 0) {
      return this.getDefaultData();
    }
    return this.groupDataByDay();
  }

  private getDefaultData(): SalesData[] {
    return [
      { day: '10am', sales: 1200 },
      { day: '11am', sales: 1800 },
      { day: '12pm', sales: 2100 },
      { day: '1pm', sales: 1900 },
      { day: '2pm', sales: 2200 },
      { day: '3pm', sales: 1800 },
      { day: '4pm', sales: 2400 },
      { day: '5pm', sales: 2800 },
      { day: '6pm', sales: 1950 },
      { day: '7pm', sales: 2100 },
      { day: '8pm', sales: 1600 },
    ];
  }

  private groupDataByDay(): SalesData[] {
    const dayMap = new Map<string, number>();
    const dayNameMap = new Map<string, string>();

    this.data.forEach((item: any) => {
      const props = item.properties || {};
      const dateStr = props.Date?.date?.start;

      if (dateStr) {
        const date = new Date(dateStr);
        const dayNum = date.getDate();
        const dayKey = `${dayNum}`;

        // Get hour or time label
        const hours = date.getHours();
        const timeLabel = `${hours}:00`;

        dayNameMap.set(dayKey, timeLabel);

        const amount = props['Receipt Amount']?.number || 0;
        dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + amount);
      }
    });

    return Array.from(dayMap.entries())
      .map(([day, sales]) => ({
        day: dayNameMap.get(day) || day,
        sales
      }))
      .sort((a, b) => parseInt(a.day) - parseInt(b.day))
      .slice(0, 11);
  }

  get maxSales(): number {
    const max = Math.max(...this.chartData.map((d) => d.sales));
    return max * 1.1;
  }

  getX(index: number): number {
    const spacing = (this.chartWidth - 2 * this.margin) / (this.chartData.length - 1);
    return this.margin + index * spacing;
  }

  getY(sales: number): number {
    const ratio = sales / this.maxSales;
    return this.chartHeight - this.margin - ratio * (this.chartHeight - 2 * this.margin);
  }

  getLinePoints(): string {
    return this.chartData
      .map((item, i) => `${this.getX(i)},${this.getY(item.sales)}`)
      .join(' ');
  }

  getAreaPath(): string {
    const points = this.chartData.map((item, i) => `${this.getX(i)},${this.getY(item.sales)}`).join(' L ');
    const startX = this.margin;
    const endX = this.getX(this.chartData.length - 1);
    const bottomY = this.chartHeight - this.margin;

    return `M ${startX},${bottomY} L ${points} L ${endX},${bottomY} Z`;
  }
}
