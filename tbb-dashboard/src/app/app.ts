import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SalesChartComponent } from './sales-chart';
import { BestSellingComponent } from './best-selling';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SalesChartComponent, BestSellingComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('my-app');
  protected readonly dataSignal = signal<any[]>([]);
  protected readonly selectedPeriod = signal<'today' | 'week' | 'month' | 'year'>('month');

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAllData();
  }

  async fetchAllData(): Promise<void> {
    const body: any = {};
    try {
      const proxyResponse: any = await firstValueFrom(
        this.http.post('/api/getAllPagesFromDB', body),
      );

      console.log('proxyResponse', proxyResponse);
      if (proxyResponse && proxyResponse.results) {
        this.dataSignal.set(proxyResponse.results);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  getAllData(): any[] {
    return this.dataSignal();
  }

  get totalSales(): number {
    return this.dataSignal().reduce((sum: number, item: any) => {
      const amount = item.properties?.Receipt_amount?.number || 0;
      return sum + amount;
    }, 0);
  }

  get totalOrders(): number {
    return this.dataSignal().length;
  }

  get completedOrders(): number {
    return this.dataSignal().filter((d: any) => {
      const status = d.properties?.Status?.select?.name || '';
      return status.toLowerCase() === 'completed' || status.toLowerCase() === 'paid';
    }).length;
  }

  get totalRevenue(): number {
    return this.dataSignal()
      .filter((d: any) => {
        const status = d.properties?.Status?.select?.name || '';
        return status.toLowerCase() === 'completed' || status.toLowerCase() === 'paid';
      })
      .reduce((sum: number, item: any) => {
        const amount = item.properties?.Receipt_amount?.number || 0;
        return sum + amount;
      }, 0);
  }

  async getAllPagesFromDB(startDate: Date, endDate: Date) {
    const formattedStartDate = startDate
      ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`
      : '';
    const formattedEndDate = endDate
      ? `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`
      : '';

    const body = {
      filter: {
        and: [
          {
            property: 'Date',
            date: {
              on_or_after: formattedStartDate,
            },
          },
          {
            property: 'Date',
            date: {
              on_or_before: formattedEndDate,
            },
          },
        ],
      },
    };
    this.http.post('http://localhost:3000/api/getAllPagesFromDB', body).subscribe({
      next: async (res: any) => {
        // console.log(res)
        // this.trades = [];
        res.results.map((prop: any) => {
          const d = new Date(prop.properties.Date.date.start);
          const dayOfWeek = d.getDay();
          const hours = d.getHours();
          const minutes = d.getMinutes();
          // Skip weekends (0 = Sunday, 6 = Saturday)
          // AND exclude the notion entry if hh:mm = 00:00
          if (dayOfWeek !== 0 && dayOfWeek !== 6 && hours !== 0 && minutes !== 0) {
            // this.trades.push({ tradeDate: `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`,
            // tradeId: prop.id });
          }
        });
        // const total = this.trades.length;
        let completed = 0;

        // for (const trade of this.trades) {
        //   // console.log("trade",trade)
        //   let relationId
        //   try {
        //      relationId = this.relations.filter(rel => rel.relationName === trade.tradeDate)[0].relationId

        //   } catch (error) {
        //     console.log("ERROR patching:",error)
        //   }
        //   const body = {
        //     "payload": {
        //       "properties": {
        //         "Activity log": {
        //           "relation": [
        //             {
        //               "id": relationId
        //             }
        //           ]
        //         }
        //       }
        //     },
        //     "url":trade.tradeId
        //   }
        //   try {
        //     const res: any = await firstValueFrom(
        //       this.http.patch("http://localhost:3000/api/patchRelationIdToTrade", body) //Patching
        //     );
        //     if (res) {
        //       console.log("Patching successful: "+trade.tradeDate)
        //     }else{
        //       console.log("Patching failed: "+trade.tradeDate)
        //     }
        //     completed++;
        //     this.progressPatching = Math.floor((completed / total) * 100);

        //   } catch (error) {
        //     this.patchingError = true
        //     console.error('Error patching:',trade, error);
        //   }
        // }
        // this.isLoadingPatching = false; //hide the progress for checking and patching, which should be located at the end of the process
        // this.isLoadingChecking = false;
      },
      error: (err) => {
        // this.patchingError = true
        console.error('Error:', err);
      },
    });
  }
}
