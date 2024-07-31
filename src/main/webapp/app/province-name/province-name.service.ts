import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ProvinceNameDTO } from 'app/province-name/province-name.model';


@Injectable({
  providedIn: 'root',
})
export class ProvinceNameService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/provinceNames';

  getAllProvinceNames() {
    return this.http.get<ProvinceNameDTO[]>(this.resourcePath);
  }

  getProvinceName(provinceId: string) {
    return this.http.get<ProvinceNameDTO>(this.resourcePath + '/' + provinceId);
  }

  createProvinceName(provinceNameDTO: ProvinceNameDTO) {
    return this.http.post<string>(this.resourcePath, provinceNameDTO);
  }

  updateProvinceName(provinceId: string, provinceNameDTO: ProvinceNameDTO) {
    return this.http.put<string>(this.resourcePath + '/' + provinceId, provinceNameDTO);
  }

  deleteProvinceName(provinceId: string) {
    return this.http.delete(this.resourcePath + '/' + provinceId);
  }

}
