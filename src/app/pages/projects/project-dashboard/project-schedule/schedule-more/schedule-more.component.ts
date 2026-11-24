import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PathActivityStep, SCHEDULE_MORE_PATHS, SchedulePathRow } from './schedule-more.data';

export type { PathActivityStep, SchedulePathRow };

@Component({
  selector: 'app-schedule-more',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './schedule-more.component.html',
  styleUrl: './schedule-more.component.scss'
})
export class ScheduleMoreComponent {
  private readonly router = inject(Router);

  @Input() projectName: string = '';
  @Input() projectCode: string = '';

  pathRows: SchedulePathRow[] = SCHEDULE_MORE_PATHS;

  openPathDetails(row: SchedulePathRow): void {
    this.router.navigate(['/projects/dashboard/schedule/more/details'], {
      queryParams: {
        sno: row.sno,
        view: null,
        projectName: this.projectName || undefined,
        projectCode: this.projectCode || undefined
      },
      queryParamsHandling: 'merge'
    });
  }
}
