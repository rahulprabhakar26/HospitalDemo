import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ProvinceNameService } from 'app/province-name/province-name.service';
import { ProvinceNameDTO } from 'app/province-name/province-name.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-province-name-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './province-name-edit.component.html'
})
export class ProvinceNameEditComponent implements OnInit {

  provinceNameService = inject(ProvinceNameService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentProvinceId?: string;

  editForm = new FormGroup({
    provinceId: new FormControl({ value: null, disabled: true }),
    provinceName: new FormControl(null, [Validators.required, Validators.maxLength(30)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@provinceName.update.success:Province Name was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentProvinceId = this.route.snapshot.params['provinceId'];
    this.provinceNameService.getProvinceName(this.currentProvinceId!)
        .subscribe({
          next: (data) => updateForm(this.editForm, data),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return;
    }
    const data = new ProvinceNameDTO(this.editForm.value);
    this.provinceNameService.updateProvinceName(this.currentProvinceId!, data)
        .subscribe({
          next: () => this.router.navigate(['/provinceNames'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
