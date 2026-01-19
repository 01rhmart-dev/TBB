import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FoodItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

@Component({
  selector: 'app-best-selling',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="best-selling-container">
      @if (topItems.length > 0) {
        <div class="items-list">
          @for (item of topItems; let i = $index; track item.name) {
            <div class="item-row">
              <div class="item-info">
                <div class="item-icon">🍔</div>
                <div class="item-details">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-price">₹{{ item.price | number:'1.2-2' }}</div>
                </div>
              </div>
              <div class="item-quantity">{{ item.quantity }}</div>
            </div>
          }
        </div>
      } @else {
        <div class="no-data">
          <p>No sales data available</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .best-selling-container {
        width: 100%;
      }

      .items-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .item-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: linear-gradient(135deg, rgba(119, 2, 255, 0.03), rgba(255, 65, 248, 0.02));
        border-radius: 8px;
        border: 1px solid rgba(119, 2, 255, 0.08);
        transition: all 0.3s ease;
      }

      .item-row:hover {
        background: linear-gradient(135deg, rgba(119, 2, 255, 0.08), rgba(255, 65, 248, 0.05));
        border-color: rgba(119, 2, 255, 0.15);
      }

      .item-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
      }

      .item-icon {
        font-size: 1.75rem;
        min-width: 40px;
        text-align: center;
      }

      .item-details {
        display: flex;
        flex-direction: column;
      }

      .item-name {
        font-weight: 600;
        color: var(--gray-900, #313233);
        font-size: 0.95rem;
      }

      .item-price {
        color: var(--gray-700, #5f5f66);
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }

      .item-quantity {
        font-weight: 700;
        color: var(--electric-violet, #7B61FF);
        font-size: 1.1rem;
        min-width: 50px;
        text-align: right;
      }

      .no-data {
        text-align: center;
        padding: 2rem;
        color: var(--gray-700, #5f5f66);
      }

      .no-data p {
        margin: 0;
        font-size: 0.95rem;
      }

      @media (max-width: 650px) {
        .item-row {
          padding: 0.75rem;
        }

        .item-icon {
          font-size: 1.5rem;
        }

        .item-name {
          font-size: 0.9rem;
        }

        .item-price {
          font-size: 0.8rem;
        }

        .item-quantity {
          font-size: 1rem;
        }
      }
    `,
  ],
})
export class BestSellingComponent {
  @Input() data: any[] = [];

  get topItems(): FoodItem[] {
    if (!this.data || this.data.length === 0) return [];

    // Group by food item and count quantities
    const itemMap = new Map<string, { name: string; price: number; quantity: number }>();

    this.data.forEach((item: any) => {
      const itemName = item.properties?.Name?.title?.[0]?.plain_text || item.properties?.Title?.title?.[0]?.plain_text || 'Unnamed Item';
      const itemPrice = item.properties?.Amount?.number || 0;

      if (itemMap.has(itemName)) {
        const existing = itemMap.get(itemName)!;
        existing.quantity += 1;
        existing.price = (existing.price + itemPrice) / 2; // Average price
      } else {
        itemMap.set(itemName, {
          name: itemName,
          price: itemPrice,
          quantity: 1,
        });
      }
    });

    // Sort by quantity and return top 5
    return Array.from(itemMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }
}
