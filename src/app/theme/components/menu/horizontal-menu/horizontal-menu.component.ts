import { Component, OnInit, Input, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router'; 
import { MatMenuTrigger } from '@angular/material/menu';
import { MenuService } from '../../../../services/menu.service';
import { Settings, SettingsService } from '../../../../services/settings.service';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MonitorStateService } from '../../../../pages/monitor/monitor-state.service';

@Component({
    selector: 'app-horizontal-menu',
    imports: [
        RouterModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './horizontal-menu.component.html',
    styleUrls: ['./horizontal-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    encapsulation: ViewEncapsulation.None
})
export class HorizontalMenuComponent implements OnInit {
  @Input('menuParentId') menuParentId: any;
  public menuItems: Array<any>;
  public settings: Settings;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  constructor(
    public settingsService: SettingsService, 
    public menuService: MenuService, 
    public router: Router,
    public monitorStateService: MonitorStateService
  ) { 
    this.settings = this.settingsService.settings;
  }

  public openBacklog(): void {
    this.monitorStateService.setOverdue(true);
    this.router.navigate(['/monitor/activities'], {
      queryParams: { overdue: 'true' }
    });
  }

  public onMenuClick(menu: any, event?: Event): void {
    if (menu.routerLink === '/monitor' || menu.title === 'Backlog' || menu.title === 'Worklists') {
      if (event) {
        event.preventDefault();
      }
      this.openBacklog();
    }
  }

  ngOnInit() {
    this.menuItems = this.menuService.getHorizontalMenuItems();
    this.menuItems = this.menuItems.filter(item => item.parentId == this.menuParentId);
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(this.settings.fixedHeader){
          let mainContent = document.getElementById('main-content');
          if(mainContent){
            mainContent.scrollTop = 0;
          }
        }
        else{
          document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
        }
      }                
    });
  } 

}