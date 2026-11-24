import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getStudyHistory, InVivoStudyItem, StudyHistoryEntry } from '../in-vivo-studies.data';

@Component({
  selector: 'app-study-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './study-history.component.html',
  styleUrl: './study-history.component.scss'
})
export class StudyHistoryComponent {
  @Input() study?: InVivoStudyItem;

  searchQuery = '';

  get filteredEntries(): StudyHistoryEntry[] {
    if (!this.study) return [];
    const entries = getStudyHistory(this.study.studyId);
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(h =>
      `${h.field} ${h.user} ${h.previousValue} ${h.newValue} ${h.reason} ${h.approvalRef}`
        .toLowerCase()
        .includes(q)
    );
  }
}
