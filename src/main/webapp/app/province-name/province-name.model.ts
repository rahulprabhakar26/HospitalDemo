export class ProvinceNameDTO {

  constructor(data:Partial<ProvinceNameDTO>) {
    Object.assign(this, data);
  }

  provinceId?: string|null;
  provinceName?: string|null;

}
