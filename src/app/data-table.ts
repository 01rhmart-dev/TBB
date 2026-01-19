import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-table-container">
      <h2 class="table-title">Data Records</h2>
      
      <div class="table-wrapper">
        @if (data && data.length > 0) {
          <table class="data-table">
            <thead>
              <tr class="table-header">
                <th>ID</th>
                <th>Title</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (item of data; let i = $index; let isOdd = $odd) {
                <tr [class.row-odd]="isOdd" class="table-row">
                  <td class="cell-id">{{ item.id ? item.id.substring(0, 8) : 'N/A' }}</td>
                  <td class="cell-title">
                    {{ item.properties?.Name?.title?.[0]?.plain_text || item.properties?.Title?.title?.[0]?.plain_text || 'Untitled' }}
                  </td>
                  <td class="cell-date">
                    {{ formatDate(item.properties?.Date?.date?.start) }}
                  </td>
                  <td class="cell-status">
                    <span class="status-badge" [class]="getStatusClass(item)">
                      {{ getStatus(item) }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <div class="no-data-message">
            <p>No data available</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .data-table-container {
        width: 100%;
        max-width: 1000px;
        margin: 2rem auto;
        padding: 2rem;
        background: linear-gradient(135deg, rgba(255, 65, 248, 0.05), rgba(119, 2, 255, 0.05));
        border-radius: 12px;
        border: 1px solid rgba(119, 2, 255, 0.1);
      }

      .table-title {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--gray-900, #313233);
      }

      .table-wrapper {
        overflow-x: auto;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
      }

      .table-header {
        background: linear-gradient(90deg, var(--orange-red), var(--vivid-pink), var(--electric-violet));
        color: white;
      }

      .table-header th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .table-row {
        border-bottom: 1px solid rgba(119, 2, 255, 0.1);
        transition: background-color 0.2s ease;
      }

      .table-row:hover {
        background-color: rgba(119, 2, 255, 0.05);
      }

      .row-odd {
        background-color: rgba(119, 2, 255, 0.02);
      }

      .table-row td {
        padding: 1rem;
        color: var(--gray-900, #313233);
      }

      .cell-id {
        font-family: 'Courier New', monospace;
        font-size: 0.85rem;
        color: var(--gray-700, #5f5f66);
        font-weight: 500;
      }

      .cell-title {
        font-weight: 500;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .cell-date {
        color: var(--gray-700, #5f5f66);
        font-size: 0.9rem;
      }

      .cell-status {
        text-align: center;
      }

      .status-badge {
        display: inline-block;
        padding: 0.375rem 0.75rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .status-active {
        background: linear-gradient(135deg, rgba(132, 250, 176, 0.2), rgba(100, 200, 150, 0.1));
        color: #059669;
      }

      .status-pending {
        background: linear-gradient(135deg, rgba(253, 224, 71, 0.2), rgba(251, 191, 36, 0.1));
        color: #d97706;
      }

      .status-inactive {
        background: linear-gradient(135deg, rgba(156, 163, 175, 0.2), rgba(107, 114, 128, 0.1));
        color: #6b7280;
      }

      .no-data-message {
        padding: 3rem;
        text-align: center;
        color: var(--gray-700, #5f5f66);
      }

      .no-data-message p {
        margin: 0;
        font-size: 1rem;
      }

      @media (max-width: 650px) {
        .data-table-container {
          padding: 1rem;
          margin: 1.5rem auto;
        }

        .table-title {
          font-size: 1.25rem;
        }

        .table-row td {
          padding: 0.75rem;
        }

        .table-header th {
          padding: 0.75rem;
          font-size: 0.85rem;
        }

        .cell-title {
          max-width: 120px;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          font-size: 0.7rem;
        }
      }
    `,
  ],
})
export class DataTableComponent {
  @Input() data: any[] = [];

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }

  getStatus(item: any): string {
    const properties = item.properties || {};
    
    if (properties.Status?.select?.name) {
      return properties.Status.select.name;
    }
    
    if (properties.Completed?.checkbox) {
      return 'Completed';
    }
    
    return 'Active';
  }

  getStatusClass(item: any): string {
    const status = this.getStatus(item);
    
    if (status === 'Completed') {
      return 'status-active';
    }
    
    if (status === 'In Progress') {
      return 'status-pending';
    }
    
    return 'status-inactive';
  }
}
