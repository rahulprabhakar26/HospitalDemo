import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AdmissionService } from 'app/admission/admission.service';
import { AdmissionDTO } from 'app/admission/admission.model';


@Component({
  selector: 'app-admission-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admission-list.component.html'})
export class AdmissionListComponent implements OnInit, OnDestroy {

  admissionService = inject(AdmissionService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  admissions?: AdmissionDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@admission.delete.success:Admission was removed successfully.`    };
    return messages[key];
  }

  ngOnInit() {
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }
  
  loadData() {
    this.admissionService.getAllAdmissions()
        .subscribe({
          next: (data) => this.admissions = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.admissionService.deleteAdmission(id)
          .subscribe({
            next: () => this.router.navigate(['/admissions'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => this.errorHandler.handleServerError(error.error)
          });
    }
  }

}
