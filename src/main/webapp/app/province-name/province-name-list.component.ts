import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ProvinceNameService } from 'app/province-name/province-name.service';
import { ProvinceNameDTO } from 'app/province-name/province-name.model';


@Component({
  selector: 'app-province-name-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './province-name-list.component.html'})
export class ProvinceNameListComponent implements OnInit, OnDestroy {

  provinceNameService = inject(ProvinceNameService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  provinceNames?: ProvinceNameDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@provinceName.delete.success:Province Name was removed successfully.`,
      'provinceName.patient.province.referenced': $localize`:@@provinceName.patient.province.referenced:This entity is still referenced by Patient ${details?.id} via field Province.`
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
    this.provinceNameService.getAllProvinceNames()
        .subscribe({
          next: (data) => this.provinceNames = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(provinceId: string) {
    if (confirm(this.getMessage('confirm'))) {
      this.provinceNameService.deleteProvinceName(provinceId)
          .subscribe({
            next: () => this.router.navigate(['/provinceNames'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/provinceNames'], {
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
