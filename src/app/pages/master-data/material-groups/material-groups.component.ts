import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface MaterialGroupRecord {
  materialGroupCode: string;
  materialGroup: string;
}

@Component({
  selector: 'app-material-groups',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './material-groups.component.html',
  styleUrl: './material-groups.component.scss',
})
export class MaterialGroupsComponent {
  readonly items: MaterialGroupRecord[] = [
    { materialGroupCode: '1001', materialGroup: 'API' },
    { materialGroupCode: '1002', materialGroup: 'Excipients' },
    { materialGroupCode: '1003', materialGroup: 'Crude' },
    { materialGroupCode: '1004', materialGroup: 'Intermediates' },
    { materialGroupCode: '1005', materialGroup: 'Raw Materials - API' },
    { materialGroupCode: '1201', materialGroup: 'Tubular Glass Vials' },
    { materialGroupCode: '1202', materialGroup: 'Moulded  Glass Vial' },
    { materialGroupCode: '1203', materialGroup: 'Victory  Glass Vial' },
    { materialGroupCode: '1204', materialGroup: 'Rubber Stopper/ Plu' },
    { materialGroupCode: '1205', materialGroup: 'Flip Off Seals' },
    { materialGroupCode: '1206', materialGroup: 'EHG Capsules' },
    { materialGroupCode: '1207', materialGroup: 'Emp.cont.Plugs&Caps' },
    { materialGroupCode: '1208', materialGroup: 'Labels' },
    { materialGroupCode: '1209', materialGroup: 'Inserts' },
    { materialGroupCode: '1210', materialGroup: 'Monocartons' },
    { materialGroupCode: '1211', materialGroup: 'Trays' },
    { materialGroupCode: '1212', materialGroup: 'Outer shipper' },
    { materialGroupCode: '1213', materialGroup: 'Inner Cartons' },
    { materialGroupCode: '1214', materialGroup: 'Thermocol' },
    { materialGroupCode: '1215', materialGroup: 'Plastic Containers' },
    { materialGroupCode: '1216', materialGroup: 'Tapes' },
    { materialGroupCode: '1217', materialGroup: 'Ampoules' },
    { materialGroupCode: '1218', materialGroup: 'Tear Off Seals' },
    { materialGroupCode: '1219', materialGroup: 'Aluminium foil' },
    { materialGroupCode: '1220', materialGroup: 'PVC' },
    { materialGroupCode: '1221', materialGroup: 'Wrapping Films' },
    { materialGroupCode: '1222', materialGroup: 'Polypropylene Vials' },
    { materialGroupCode: '1223', materialGroup: 'PP Closures / Caps' },
    { materialGroupCode: '1224', materialGroup: 'PVC/Aclar film' },
    { materialGroupCode: '1225', materialGroup: 'HDPE Bottle' },
    { materialGroupCode: '1226', materialGroup: 'Blister Pack' },
    { materialGroupCode: '1227', materialGroup: 'Silicagel' },
    { materialGroupCode: '1228', materialGroup: 'SYRINGE' },
    { materialGroupCode: '1229', materialGroup: 'Gel' },
    { materialGroupCode: '1230', materialGroup: 'Spray' },
    { materialGroupCode: '1301', materialGroup: 'SFG-Common Blend' },
    { materialGroupCode: '1302', materialGroup: 'SFG-Orals' },
    { materialGroupCode: '1303', materialGroup: 'SFG-Injectables' },
    { materialGroupCode: '1501', materialGroup: 'Working Standards' },
    { materialGroupCode: '1502', materialGroup: 'Rare chemicals' },
    { materialGroupCode: '1503', materialGroup: 'Solvents' },
    { materialGroupCode: '1504', materialGroup: 'Acids' },
    { materialGroupCode: '1505', materialGroup: 'Sulfuric group' },
    { materialGroupCode: '1506', materialGroup: 'Glassware' },
    { materialGroupCode: '1507', materialGroup: 'Disposables' },
    { materialGroupCode: '1508', materialGroup: 'Disinfectant' },
    { materialGroupCode: '1509', materialGroup: 'Media' },
    { materialGroupCode: '1510', materialGroup: 'Equipment' },
    { materialGroupCode: '1511', materialGroup: 'Column' },
    { materialGroupCode: '1512', materialGroup: 'Impurity standard' },
    { materialGroupCode: '1513', materialGroup: 'Culture' },
    { materialGroupCode: '1514', materialGroup: 'Biological Indicator' },
    { materialGroupCode: '1515', materialGroup: 'Reference Standards' },
    { materialGroupCode: '1516', materialGroup: 'Primary Standards' },
    { materialGroupCode: '1517', materialGroup: 'Diluents' },
    { materialGroupCode: '1518', materialGroup: 'Sampling Chemicals' },
    { materialGroupCode: '1519', materialGroup: 'Lab Consumables' },
    { materialGroupCode: '1601', materialGroup: 'IT Consumables' },
    { materialGroupCode: '1602', materialGroup: 'Stationary' },
    { materialGroupCode: '1603', materialGroup: 'House keeping' },
    { materialGroupCode: '1604', materialGroup: 'Stationary&Admin Con' },
    { materialGroupCode: '1605', materialGroup: 'Other' },
    { materialGroupCode: '1701', materialGroup: 'Spare parts' },
    { materialGroupCode: '1702', materialGroup: 'Utilities' },
    { materialGroupCode: '1703', materialGroup: 'Machinery Consumable' },
    { materialGroupCode: '1704', materialGroup: 'Change Parts' },
    { materialGroupCode: '1705', materialGroup: 'Engg. Consumables' },
    { materialGroupCode: '1706', materialGroup: 'Instrument' },
    { materialGroupCode: '1707', materialGroup: 'Miscellaneous' },
    { materialGroupCode: '1708', materialGroup: 'Production Consumabl' },
    { materialGroupCode: '1709', materialGroup: 'Projects' },
    { materialGroupCode: '1710', materialGroup: 'Electrical' },
    { materialGroupCode: '1711', materialGroup: 'Equipment (Capex)' },
    { materialGroupCode: '1801', materialGroup: 'Service' },
    { materialGroupCode: '2001', materialGroup: 'CEPH-Dry Powder Inj.' },
    { materialGroupCode: '2002', materialGroup: 'CEPH-Diluents' },
    { materialGroupCode: '2003', materialGroup: 'CEPH-Tablets' },
    { materialGroupCode: '2004', materialGroup: 'CEPH-Capsules' },
    { materialGroupCode: '2005', materialGroup: 'CEPH-Dry Syrups' },
    { materialGroupCode: '2006', materialGroup: 'ONC-Liquid Lyophilis' },
    { materialGroupCode: '2007', materialGroup: 'ONC-Tablets' },
    { materialGroupCode: '2008', materialGroup: 'ONC-Capsules' },
    { materialGroupCode: '2009', materialGroup: 'CON-Small Vol.Parent' },
    { materialGroupCode: '2010', materialGroup: 'CON-Large Vol.Parent' },
    { materialGroupCode: '2011', materialGroup: 'Orals' },
    { materialGroupCode: '2012', materialGroup: 'Injections' },
    { materialGroupCode: '2013', materialGroup: 'Vial' },
    { materialGroupCode: '2014', materialGroup: 'Bottles' },
    { materialGroupCode: '2015', materialGroup: 'vibgyor materials' },
    { materialGroupCode: '2016', materialGroup: 'GLASS BOTTLE' },
    { materialGroupCode: '2017', materialGroup: 'container' },
    { materialGroupCode: '2018', materialGroup: 'closure' },
    { materialGroupCode: '2019', materialGroup: 'POUCH' },
    { materialGroupCode: '2020', materialGroup: 'Cotton Filler' },
    { materialGroupCode: '2021', materialGroup: 'Lidocaine' },
    { materialGroupCode: '2022', materialGroup: 'Inhalation' },
    { materialGroupCode: '8001', materialGroup: 'Rubber stopper' },
    { materialGroupCode: '8002', materialGroup: 'Prefilled Syringes' },
    { materialGroupCode: '8003', materialGroup: 'Plunger Rod' },
    { materialGroupCode: '8004', materialGroup: 'PIL' },
    { materialGroupCode: '8005', materialGroup: 'Printed Carton' },
    { materialGroupCode: '8006', materialGroup: 'Chemicals' },
    { materialGroupCode: '8007', materialGroup: 'Media' },
    { materialGroupCode: '8008', materialGroup: 'Feed' },
    { materialGroupCode: '8009', materialGroup: 'Crude' },
    { materialGroupCode: '8010', materialGroup: 'Resins' },
    { materialGroupCode: '8011', materialGroup: 'Buffer' },
    { materialGroupCode: '8012', materialGroup: 'AI-NUTRACEUTICAL' },
    { materialGroupCode: '8013', materialGroup: 'EXCIPIENT-NUTRACEUTI' },
    { materialGroupCode: '8014', materialGroup: 'CWIP' },
    { materialGroupCode: '8015', materialGroup: 'AMC Services' },
    { materialGroupCode: '8016', materialGroup: 'CMC Services' },
    { materialGroupCode: '8017', materialGroup: 'Calibration Services' },
    { materialGroupCode: '8018', materialGroup: 'Repairs and Maint' },
    { materialGroupCode: '8019', materialGroup: 'Consulting Services' },
    { materialGroupCode: '8020', materialGroup: 'Software Maintenance' },
    { materialGroupCode: '8021', materialGroup: 'Jobwork Service' },
    { materialGroupCode: '8022', materialGroup: 'Administration Serv' },
    { materialGroupCode: '8023', materialGroup: 'Canteen Services' },
    { materialGroupCode: '8024', materialGroup: 'Emp Bus Transport' },
    { materialGroupCode: '8025', materialGroup: 'Security Services' },
    { materialGroupCode: '8026', materialGroup: 'Manpower Service' },
    { materialGroupCode: '8027', materialGroup: 'Analytical & Testing' },
    { materialGroupCode: '8028', materialGroup: 'Errection Comm&Insta' },
    { materialGroupCode: '8029', materialGroup: 'Factory Maintenance' },
    { materialGroupCode: '8030', materialGroup: 'Sales Commission' },
    { materialGroupCode: '8031', materialGroup: 'Patents & Trade Mark' },
    { materialGroupCode: '8032', materialGroup: 'Russia Proj Services' },
    { materialGroupCode: '8033', materialGroup: 'Insurance Service' },
    { materialGroupCode: '8034', materialGroup: 'Freight Charges' },
    { materialGroupCode: '8035', materialGroup: 'Factory Maint Expen' },
    { materialGroupCode: '8036', materialGroup: 'Professional Fee' },
    { materialGroupCode: '8037', materialGroup: 'Carriage & Freig Out' },
    { materialGroupCode: '8038', materialGroup: 'Service Lab Consumab' },
    { materialGroupCode: '8039', materialGroup: 'Rates & Taxes' },
    { materialGroupCode: '8040', materialGroup: 'Cell Line' },
    { materialGroupCode: '8041', materialGroup: 'Samples' },
    { materialGroupCode: '8042', materialGroup: 'Scrap' },
    { materialGroupCode: '8043', materialGroup: 'Raw Materials - EXP' },
    { materialGroupCode: 'ASSET', materialGroup: 'ASSETS' },
    { materialGroupCode: 'O-BUSTERS', materialGroup: 'O-BUSTERS' },
    { materialGroupCode: 'REG', materialGroup: 'Regulatory' },
    { materialGroupCode: 'ROW', materialGroup: 'Rest of the World' },
    { materialGroupCode: 'TABLET', materialGroup: 'Tablets' },
    { materialGroupCode: 'U-TEST', materialGroup: 'Under Test' },
  ];

  showFilter = false;
  keyword = '';
  searchKeyword = '';

  pageIndex = 0;
  pageSize = 10;
  readonly pageSizeOptions = [10, 20, 50, 100];

  get filteredItems(): MaterialGroupRecord[] {
    return this.items.filter((item) => {
      if (!this.searchKeyword) return true;
      const kw = this.searchKeyword.toLowerCase();
      return (
        item.materialGroupCode.toLowerCase().includes(kw) ||
        item.materialGroup.toLowerCase().includes(kw)
      );
    });
  }

  get paginatedItems(): MaterialGroupRecord[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.searchKeyword = '';
    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
