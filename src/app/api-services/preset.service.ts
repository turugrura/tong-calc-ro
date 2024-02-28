import { Injectable } from '@angular/core';
import { BaseAPIService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GetMyEntirePresetsResponse, GetMyPresetsResponse, RoPresetModel } from './models';

@Injectable()
export class PresetService extends BaseAPIService {
  constructor(protected readonly http: HttpClient, protected readonly jwtHelper: JwtHelperService) {
    super();
  }

  getPreset(presetId: string) {
    return this.get<RoPresetModel>(`${this.API.getMyPreset}/${presetId}`);
  }

  getMyPresets() {
    return this.get<GetMyPresetsResponse>(`${this.API.getMyPreset}`);
  }

  getEntirePresets() {
    return this.get<GetMyEntirePresetsResponse>(`${this.API.getMyEntirePreset}`);
  }

  createPreset(preset: Pick<RoPresetModel, 'label' | 'model'>) {
    return this.post<RoPresetModel>(`${this.API.createMyPreset}`, preset);
  }

  bulkCreatePresets(bulkPreset: { bulkData: any[] }) {
    return this.post<RoPresetModel[]>(`${this.API.bulkCreateMyPresets}`, bulkPreset);
  }

  updatePreset(id: string, preset: Pick<RoPresetModel, 'label' | 'model'>) {
    return this.post<RoPresetModel>(`${this.API.getMyPreset}/${id}`, preset);
  }

  deletePreset(id: string) {
    return this.delete<RoPresetModel>(`${this.API.getMyPreset}/${id}`);
  }
}
