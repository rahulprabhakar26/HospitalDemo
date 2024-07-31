import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ProvinceNameService } from 'app/province-name/province-name.service';
import { ProvinceNameDTO } from 'app/province-name/province-name.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-province-name-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './province-name-add.component.html'
})
export class ProvinceNameAddComponent {

  provinceNameService = inject(ProvinceNameService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    provinceId: new FormControl(null, [Validators.required, Validators.maxLength(2)]),
    provinceName: new FormControl(null, [Validators.required, Validators.maxLength(30)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@provinceName.create.success:Province Name was created successfully.`,
      PROVINCE_NAME_PROVINCE_ID_VALID: $localize`:@@Exists.provinceName.provinceId:This Province Id is already taken.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new ProvinceNameDTO(this.addForm.value);
    this.provinceNameService.createProvinceName(data)
        .subscribe({
          next: () => this.router.navigate(['/provinceNames'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
