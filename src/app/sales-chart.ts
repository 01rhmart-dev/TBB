import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SalesData {
  month: string;
  sales: number;
}

@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sales-chart-container">
      <h2 class="chart-title">Monthly Sales</h2>
      <div class="chart-wrapper">
        <svg [attr.viewBox]="'0 0 ' + chartWidth + ' ' + chartHeight" class="chart-svg">
          <defs>
            <linearGradient id="sales-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#7B61FF;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FF41F8;stop-opacity:1" />
            </linearGradient>
          </defs>

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

          <!-- Bars -->
          @for (item of salesData; let i = $index; track item.month) {
            <g [attr.class]="'bar-group'">
              <!-- Bar -->
              <rect
                [attr.x]="margin + i * barSpacing + barPadding"
                [attr.y]="
                  chartHeight - margin - (item.sales / maxSales) * (chartHeight - 2 * margin)
                "
                [attr.width]="barWidth"
                [attr.height]="(item.sales / maxSales) * (chartHeight - 2 * margin)"
                class="bar"
              />
              <!-- Label -->
              <text
                [attr.x]="margin + i * barSpacing + barSpacing / 2"
                [attr.y]="chartHeight - margin + 25"
                class="bar-label"
              >
                {{ item.month }}
              </text>
              <!-- Value -->
              <text
                [attr.x]="margin + i * barSpacing + barSpacing / 2"
                [attr.y]="
                  chartHeight - margin - (item.sales / maxSales) * (chartHeight - 2 * margin) - 8
                "
                class="bar-value"
              >
                \${{ item.sales }}K
              </text>
            </g>
          }
        </svg>
      </div>
      <div class="chart-legend">
        <p>Sales in thousands of dollars</p>
      </div>
    </div>
  `,
  styles: [
    `
      .sales-chart-container {
        width: 100%;
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
        background: linear-gradient(135deg, rgba(255, 65, 248, 0.05), rgba(119, 2, 255, 0.05));
        border-radius: 12px;
        border: 1px solid rgba(119, 2, 255, 0.1);
      }

      .chart-title {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--gray-900, #313233);
      }

      .chart-wrapper {
        width: 100%;
        aspect-ratio: 16 / 9;
        margin-bottom: 1rem;
      }

      .chart-svg {
        width: 100%;
        height: 100%;
      }

      .axis {
        stroke: var(--gray-400, #b3b3b7);
        stroke-width: 2;
      }

      .bar-group {
        pointer-events: all;
      }

      .bar {
        fill: url(#sales-gradient);
        transition: opacity 0.3s ease;
      }

      .bar:hover {
        opacity: 0.8;
      }

      .bar-label {
        font-size: 12px;
        fill: var(--gray-700, #5f5f66);
        text-anchor: middle;
        font-weight: 500;
      }

      .bar-value {
        font-size: 11px;
        fill: var(--gray-900, #313233);
        text-anchor: middle;
        font-weight: 600;
      }

      .chart-legend {
        text-align: center;
        color: var(--gray-700, #5f5f66);
        font-size: 0.875rem;
        margin: 0;
      }

      .chart-legend p {
        margin: 0;
      }

      @media (max-width: 650px) {
        .sales-chart-container {
          padding: 1rem;
          margin: 1.5rem auto;
        }

        .chart-title {
          font-size: 1.25rem;
        }

        .chart-wrapper {
          aspect-ratio: 4 / 3;
        }

        .bar-label {
          font-size: 10px;
        }

        .bar-value {
          font-size: 9px;
        }
      }
    `,
  ],
})
export class SalesChartComponent {
  salesData: SalesData[] = [
    { month: 'Jan', sales: 45 },
    { month: 'Feb', sales: 52 },
    { month: 'Mar', sales: 48 },
    { month: 'Apr', sales: 61 },
    { month: 'May', sales: 55 },
    { month: 'Jun', sales: 67 },
    { month: 'Jul', sales: 72 },
    { month: 'Aug', sales: 68 },
  ];

  chartWidth = 800;
  chartHeight = 400;
  margin = 50;
  barPadding = 12;

  get maxSales(): number {
    return Math.max(...this.salesData.map((d) => d.sales)) * 1.1;
  }

  get barSpacing(): number {
    return (this.chartWidth - 2 * this.margin) / this.salesData.length;
  }

  get barWidth(): number {
    return this.barSpacing - 2 * this.barPadding;
  }
}
