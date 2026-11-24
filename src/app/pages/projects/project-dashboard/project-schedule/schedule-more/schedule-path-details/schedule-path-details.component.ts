import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SCHEDULE_MORE_PATHS, SchedulePathRow } from '../schedule-more.data';

export interface PathDetailTask {
  id: string;
  name: string;
  deliverable: string;
  owner: string;
  ccpDays: number;
  ccmDays: number;
  planStart: Date;
  planEnd: Date;
  chainStart: Date;
  chainEnd: Date;
  status: 'Completed' | 'In Process' | 'Pending' | 'Overdue';
  completion: number;
}

interface TimelineDay {
  date: number;
  name: string;
}

interface TimelineMonth {
  name: string;
  daysCount: number;
  width: number;
}

interface TimelineWeek {
  weekNumber: number;
  label: string;
  startDate: Date;
  monthName: string;
}

interface TimelineMonthColumn {
  name: string;
  unitLabel: string;
  daysText: string;
}

interface GanttBar {
  left: number;
  width: number;
  color: string;
  label: string;
  completion: number;
}

@Component({
  selector: 'app-schedule-path-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './schedule-path-details.component.html',
  styleUrl: './schedule-path-details.component.scss'
})
export class SchedulePathDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @ViewChild('ganttViewport') ganttViewport!: ElementRef<HTMLDivElement>;

  pathRow: SchedulePathRow = SCHEDULE_MORE_PATHS[0];
  projectName: string = 'Acrylic Emulsion Binder 50% Solids';
  projectCode: string = '2026/CHM/006';

  viewMode: 'gantt' | 'grid' = 'gantt';
  timeScale: 'daily' | 'weekly' | 'monthly' = 'monthly';

  leftPaneWidth: number = 560;
  isResizing: boolean = false;
  private startResizeX: number = 0;
  private startPaneWidth: number = 0;
  private containerElemWidth: number = 1200;

  dayWidth: number = 36;
  weekWidth: number = 80;
  monthWidth: number = 240;

  timelineDays: TimelineDay[] = [];
  timelineMonths: TimelineMonth[] = [];
  timelineWeeks: TimelineWeek[] = [];
  timelineWeeksMonths: TimelineMonth[] = [];
  timelineMonthlyColumns: TimelineMonthColumn[] = [];

  tasks: PathDetailTask[] = [];

  constructor() {
    this.initializeTimeline();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName']) {
        this.projectName = params['projectName'];
      }
      if (params['projectCode']) {
        this.projectCode = params['projectCode'];
      }
      const sno = Number(params['sno']) || 1;
      const found = SCHEDULE_MORE_PATHS.find(r => r.sno === sno);
      this.pathRow = found || SCHEDULE_MORE_PATHS[0];
      this.buildTasksFromPathRow(this.pathRow);
    });
  }

  private buildTasksFromPathRow(row: SchedulePathRow): void {
    let cpCursor = new Date(2026, 5, 1);
    let ccCursor = new Date(2026, 5, 1);

    this.tasks = row.steps.map((step, index) => {
      const cpStart = new Date(cpCursor.getFullYear(), cpCursor.getMonth(), cpCursor.getDate());
      const cpDuration = Math.max(1, step.ccpDays);
      const cpEnd = new Date(cpStart.getFullYear(), cpStart.getMonth(), cpStart.getDate() + cpDuration - 1);
      cpCursor = new Date(cpEnd.getFullYear(), cpEnd.getMonth(), cpEnd.getDate() + 1);

      const ccStart = new Date(ccCursor.getFullYear(), ccCursor.getMonth(), ccCursor.getDate());
      const ccDuration = Math.max(1, step.ccmDays);
      const ccEnd = new Date(ccStart.getFullYear(), ccStart.getMonth(), ccStart.getDate() + ccDuration - 1);
      ccCursor = new Date(ccEnd.getFullYear(), ccEnd.getMonth(), ccEnd.getDate() + 1);

      const completion =
        step.status === 'Completed' ? 100 :
        step.status === 'In Process' ? 75 :
        step.status === 'Overdue' ? 40 : 0;

      return {
        id: `MP-${row.sno}-${index + 1}`,
        name: step.name,
        deliverable: step.stage,
        owner: step.owner,
        ccpDays: step.ccpDays,
        ccmDays: step.ccmDays,
        planStart: cpStart,
        planEnd: cpEnd,
        chainStart: ccStart,
        chainEnd: ccEnd,
        status: step.status,
        completion
      };
    });
  }

  get totalTimelineWidth(): number {
    if (this.timeScale === 'weekly') {
      return this.timelineWeeks.length * this.weekWidth;
    } else if (this.timeScale === 'monthly') {
      return this.timelineMonthlyColumns.length * this.monthWidth;
    }
    return this.timelineDays.length * this.dayWidth;
  }

  setView(mode: 'gantt' | 'grid'): void {
    this.viewMode = mode;
  }

  onTimeScaleChange(): void {
    if (this.ganttViewport?.nativeElement) {
      this.ganttViewport.nativeElement.scrollLeft = 0;
    }
  }

  scrollGantt(direction: 'left' | 'right'): void {
    if (this.ganttViewport?.nativeElement) {
      const scrollAmount = 350;
      const element = this.ganttViewport.nativeElement;
      const targetScroll = direction === 'right'
        ? element.scrollLeft + scrollAmount
        : element.scrollLeft - scrollAmount;
      element.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  }

  initResize(event: MouseEvent): void {
    this.isResizing = true;
    event.preventDefault();
    this.startResizeX = event.clientX;
    this.startPaneWidth = this.leftPaneWidth;

    const container = (event.target as HTMLElement).closest('.gantt-split-container');
    if (container) {
      this.containerElemWidth = container.clientWidth;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isResizing) {
      const deltaX = event.clientX - this.startResizeX;
      this.leftPaneWidth = Math.max(200, Math.min(this.containerElemWidth - 100, this.startPaneWidth + deltaX));
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.isResizing) {
      this.isResizing = false;
    }
  }

  getStatusClass(status: string): string {
    return (status || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  formatDate(d: Date | null): string {
    if (!d) return '—';
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${monthList[d.getMonth()]}`;
  }

  getDayOffset(d: Date): number {
    const timelineStart = new Date(2026, 5, 1);
    const startOfD = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const startOfTimeline = new Date(timelineStart.getFullYear(), timelineStart.getMonth(), timelineStart.getDate());
    return Math.floor((startOfD.getTime() - startOfTimeline.getTime()) / (1000 * 60 * 60 * 24));
  }

  getDateOffsetPixels(d: Date): number {
    if (this.timeScale === 'weekly') {
      const timelineStart = new Date(2026, 5, 1);
      const startOfD = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const diffDays = (startOfD.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
      return Math.max(0, (diffDays / 7) * this.weekWidth);
    } else if (this.timeScale === 'monthly') {
      const monthIndex = d.getMonth() - 5;
      const clampedMonthIndex = Math.max(0, Math.min(4, monthIndex));
      const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const dayFraction = Math.max(0, Math.min(1, (d.getDate() - 1) / daysInMonth));
      return (clampedMonthIndex + dayFraction) * this.monthWidth;
    } else {
      const offset = this.getDayOffset(d);
      const totalDays = this.timelineDays.length;
      const clamped = Math.max(0, Math.min(totalDays - 1, offset));
      return clamped * this.dayWidth;
    }
  }

  getDateEndPixels(d: Date): number {
    if (this.timeScale === 'weekly') {
      const timelineStart = new Date(2026, 5, 1);
      const startOfD = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const diffDays = ((startOfD.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return Math.max(0, (diffDays / 7) * this.weekWidth);
    } else if (this.timeScale === 'monthly') {
      const monthIndex = d.getMonth() - 5;
      const clampedMonthIndex = Math.max(0, Math.min(4, monthIndex));
      const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const dayFraction = Math.max(0, Math.min(1, d.getDate() / daysInMonth));
      return (clampedMonthIndex + dayFraction) * this.monthWidth;
    } else {
      const offset = this.getDayOffset(d);
      const totalDays = this.timelineDays.length;
      const clamped = Math.max(0, Math.min(totalDays - 1, offset));
      return (clamped + 1) * this.dayWidth;
    }
  }

  getCriticalChainBar(task: PathDetailTask): GanttBar {
    const left = this.getDateOffsetPixels(task.chainStart);
    const endPixels = this.getDateEndPixels(task.chainEnd);
    const minWidth = this.timeScale === 'weekly' ? 24 : (this.timeScale === 'monthly' ? 20 : this.dayWidth);
    const width = Math.max(minWidth, endPixels - left);

    return {
      left,
      width,
      color: '#ef4444',
      label: 'Critical Chain',
      completion: task.completion
    };
  }

  private initializeTimeline(): void {
    this.initializeTimelineDays();
    this.initializeTimelineWeeks();
    this.initializeTimelineMonths();
  }

  private initializeTimelineDays(): void {
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const tempDays: TimelineDay[] = [];
    const tempMonths: TimelineMonth[] = [];
    const startDate = new Date(2026, 5, 1);
    const endDate = new Date(2026, 9, 31);
    const monthNames = ['June 2026', 'July 2026', 'August 2026', 'September 2026', 'October 2026'];
    let current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    let currentMonthName = '';
    let currentMonthCount = 0;

    while (current <= endDate) {
      const dayLetter = daysOfWeek[current.getDay()];
      const mIdx = current.getMonth() - 5;
      const mName = (mIdx >= 0 && mIdx < monthNames.length) ? monthNames[mIdx] : '';
      tempDays.push({ date: current.getDate(), name: dayLetter });

      if (mName !== currentMonthName) {
        if (currentMonthName !== '') {
          tempMonths.push({ name: currentMonthName, daysCount: currentMonthCount, width: currentMonthCount * this.dayWidth });
        }
        currentMonthName = mName;
        currentMonthCount = 0;
      }
      currentMonthCount++;
      current.setDate(current.getDate() + 1);
    }

    if (currentMonthCount > 0) {
      tempMonths.push({ name: currentMonthName, daysCount: currentMonthCount, width: currentMonthCount * this.dayWidth });
    }

    this.timelineDays = tempDays;
    this.timelineMonths = tempMonths;
  }

  private initializeTimelineWeeks(): void {
    const weeks: TimelineWeek[] = [];
    const monthNames = ['June 2026', 'July 2026', 'August 2026', 'September 2026', 'October 2026'];
    const monthWeekCounts = [0, 0, 0, 0, 0];
    const startDate = new Date(2026, 5, 1);
    const endDate = new Date(2026, 9, 31);
    let current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    let weekNum = 1;

    while (current <= endDate) {
      const mIdx = Math.max(0, Math.min(4, current.getMonth() - 5));
      monthWeekCounts[mIdx]++;
      weeks.push({ weekNumber: weekNum, label: `Week ${weekNum}`, startDate: new Date(current), monthName: monthNames[mIdx] });
      weekNum++;
      current.setDate(current.getDate() + 7);
    }

    this.timelineWeeks = weeks;
    this.timelineWeeksMonths = monthNames.map((name, idx) => ({
      name,
      daysCount: monthWeekCounts[idx] * 7,
      width: monthWeekCounts[idx] * this.weekWidth
    }));
  }

  private initializeTimelineMonths(): void {
    this.timelineMonthlyColumns = [
      { name: 'June 2026', unitLabel: 'Month 1', daysText: '30 Days' },
      { name: 'July 2026', unitLabel: 'Month 2', daysText: '31 Days' },
      { name: 'August 2026', unitLabel: 'Month 3', daysText: '31 Days' },
      { name: 'September 2026', unitLabel: 'Month 4', daysText: '30 Days' },
      { name: 'October 2026', unitLabel: 'Month 5', daysText: '31 Days' }
    ];
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/schedule'], {
      queryParams: {
        view: 'more',
        sno: null,
        projectName: this.projectName || undefined,
        projectCode: this.projectCode || undefined
      },
      queryParamsHandling: 'merge'
    });
  }
}
