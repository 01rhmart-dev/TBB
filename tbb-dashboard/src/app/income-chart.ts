import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface IncomeData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-income-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="income-container">
      <div class="chart-section">
        <svg [attr.viewBox]="'0 0 ' + chartSize + ' ' + chartSize" class="donut-svg">
          <defs>
            <linearGradient id="gradient-0" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" [attr.stop-color]="colorPalette[0]" stop-opacity="1" />
              <stop offset="100%" [attr.stop-color]="adjustBrightness(colorPalette[0], -20)" stop-opacity="1" />
            </linearGradient>
            <linearGradient id="gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" [attr.stop-color]="colorPalette[1]" stop-opacity="1" />
              <stop offset="100%" [attr.stop-color]="adjustBrightness(colorPalette[1], -20)" stop-opacity="1" />
            </linearGradient>
            <linearGradient id="gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" [attr.stop-color]="colorPalette[2]" stop-opacity="1" />
              <stop offset="100%" [attr.stop-color]="adjustBrightness(colorPalette[2], -20)" stop-opacity="1" />
            </linearGradient>
            <linearGradient id="gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" [attr.stop-color]="colorPalette[3]" stop-opacity="1" />
              <stop offset="100%" [attr.stop-color]="adjustBrightness(colorPalette[3], -20)" stop-opacity="1" />
            </linearGradient>
            <linearGradient id="gradient-4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" [attr.stop-color]="colorPalette[4]" stop-opacity="1" />
              <stop offset="100%" [attr.stop-color]="adjustBrightness(colorPalette[4], -20)" stop-opacity="1" />
            </linearGradient>
            <linearGradient id="gradient-5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" [attr.stop-color]="colorPalette[5]" stop-opacity="1" />
              <stop offset="100%" [attr.stop-color]="adjustBrightness(colorPalette[5], -20)" stop-opacity="1" />
            </linearGradient>
          </defs>

          <!-- Donut slices -->
          @for (slice of chartData; let i = $index; track slice.name) {
            <path
              [attr.d]="getArcPath(i)"
              [attr.fill]="'url(#gradient-' + i + ')'"
              class="donut-slice"
              [attr.data-index]="i"
            />
          }

          <!-- Center circle for donut effect -->
          <circle cx="50%" cy="50%" r="35%" fill="white" />

          <!-- Center text -->
          <text x="50%" y="45%" class="center-label">Total Sales</text>
          <text x="50%" y="55%" class="center-amount">₹{{ totalAmount | number:'1.0-0' }}</text>
        </svg>
      </div>

      <div class="legend-section">
        @for (item of chartData; let i = $index; track item.name) {
          <div class="legend-item">
            <span class="legend-color" [style.backgroundColor]="item.color"></span>
            <div class="legend-text">
              <div class="legend-name">{{ item.name }}</div>
              <div class="legend-amount">₹{{ item.amount | number:'1.0-0' }}</div>
            </div>
            <div class="legend-percentage">{{ item.percentage }}%</div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .income-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: center;
      }

      .chart-section {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .donut-svg {
        width: 100%;
        max-width: 300px;
        height: auto;
      }

      .donut-slice {
        cursor: pointer;
        transition: filter 0.3s ease;
      }

      .donut-slice:hover {
        filter: brightness(1.1);
      }

      .center-label {
        font-size: 12px;
        fill: var(--gray-700, #5f5f66);
        text-anchor: middle;
        font-weight: 500;
        pointer-events: none;
      }

      .center-amount {
        font-size: 20px;
        font-weight: 700;
        fill: var(--gray-900, #313233);
        text-anchor: middle;
        pointer-events: none;
        font-family:
          'Inter Tight',
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          Roboto,
          Helvetica,
          Arial,
          sans-serif;
      }

      .legend-section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 6px;
        background: linear-gradient(135deg, rgba(119, 2, 255, 0.02), rgba(255, 65, 248, 0.01));
        transition: all 0.3s ease;
      }

      .legend-item:hover {
        background: linear-gradient(135deg, rgba(119, 2, 255, 0.08), rgba(255, 65, 248, 0.05));
      }

      .legend-color {
        min-width: 16px;
        width: 16px;
        height: 16px;
        border-radius: 3px;
      }

      .legend-text {
        flex: 1;
      }

      .legend-name {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--gray-900, #313233);
        margin-bottom: 0.25rem;
      }

      .legend-amount {
        font-size: 0.8rem;
        color: var(--gray-700, #5f5f66);
      }

      .legend-percentage {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--electric-violet, #7B61FF);
        min-width: 45px;
        text-align: right;
      }

      @media (max-width: 900px) {
        .income-container {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .donut-svg {
          max-width: 250px;
        }

        .center-amount {
          font-size: 18px;
        }
      }

      @media (max-width: 650px) {
        .income-container {
          gap: 1rem;
        }

        .donut-svg {
          max-width: 200px;
        }

        .center-label {
          font-size: 10px;
        }

        .center-amount {
          font-size: 14px;
        }

        .legend-item {
          padding: 0.5rem;
        }

        .legend-name {
          font-size: 0.8rem;
        }

        .legend-amount {
          font-size: 0.75rem;
        }

        .legend-percentage {
          font-size: 0.75rem;
        }
      }
    `,
  ],
})
export class IncomeChartComponent {
  @Input() data: any[] = [];

  chartSize = 400;
  innerRadius = 140;
  outerRadius = 200;
  centerX = this.chartSize / 2;
  centerY = this.chartSize / 2;

  colorPalette = [
    '#4ECDC4', // Turquoise
    '#FFD93D', // Yellow
    '#FF6B6B', // Red
    '#6C5CE7', // Purple
    '#00B894', // Green
    '#FF7F50', // Coral
  ];

  get chartData(): IncomeData[] {
    if (!this.data || this.data.length === 0) return [];

    const categoryMap = new Map<string, number>();

    this.data.forEach((item: any) => {
      const props = item.properties || {};
      const itemName = props.Item?.rich_text?.[0]?.plain_text || 'Other';
      const amount = props['Receipt Amount']?.number || 0;

      categoryMap.set(itemName, (categoryMap.get(itemName) || 0) + amount);
    });

    const total = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);

    return Array.from(categoryMap.entries())
      .map(([name, amount], index) => ({
        name,
        amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
        color: this.colorPalette[index % this.colorPalette.length],
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  get totalAmount(): number {
    return this.chartData.reduce((sum, item) => sum + item.amount, 0);
  }

  private currentAngle = 0;

  getArcPath(index: number): string {
    const data = this.chartData;
    const total = this.totalAmount;

    let startAngle = this.currentAngle;
    const sliceAngle = (data[index].amount / total) * 360;
    const endAngle = startAngle + sliceAngle;

    this.currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = this.centerX + this.outerRadius * Math.cos(startRad);
    const y1 = this.centerY + this.outerRadius * Math.sin(startRad);
    const x2 = this.centerX + this.outerRadius * Math.cos(endRad);
    const y2 = this.centerY + this.outerRadius * Math.sin(endRad);

    const x3 = this.centerX + this.innerRadius * Math.cos(endRad);
    const y3 = this.centerY + this.innerRadius * Math.sin(endRad);
    const x4 = this.centerX + this.innerRadius * Math.cos(startRad);
    const y4 = this.centerY + this.innerRadius * Math.sin(startRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${this.outerRadius} ${this.outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${this.innerRadius} ${this.innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;
  }

  adjustBrightness(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }
}
