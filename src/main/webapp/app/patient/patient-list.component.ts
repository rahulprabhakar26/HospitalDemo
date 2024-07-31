import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { PatientService } from 'app/patient/patient.service';
import { PatientDTO } from 'app/patient/patient.model';


@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-list.component.html'})
export class PatientListComponent implements OnInit, OnDestroy {

  patientService = inject(PatientService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  patients?: PatientDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@patient.delete.success:Patient was removed successfully.`,
      'patient.admission.patient.referenced': $localize`:@@patient.admission.patient.referenced:This entity is still referenced by Admission ${details?.id} via field Patient.`
    };
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
    this.patientService.getAllPatients()
        .subscribe({
          next: (data) => this.patients = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(patientId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.patientService.deletePatient(patientId)
          .subscribe({
            next: () => this.router.navigate(['/patients'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/patients'], {
                  state: {
                    msgError: this.getMessage(messageParts[0], { id: messageParts[1] })
                  }
                });
                return;
              }
              this.errorHandler.handleServerError(error.error)
            }
          });
    }
  }

}
