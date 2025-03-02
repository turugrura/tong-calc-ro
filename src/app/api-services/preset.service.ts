import { Injectable } from '@angular/core';
import { BaseAPIService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  BulkOperationRequest,
  GetMyEntirePresetsResponse,
  GetMyPresetsResponse,
  LikeTagResponse,
  PresetWithTagsModel,
  PublishPresetsReponse,
  RoPresetModel,
} from './models';

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

  updatePreset(id: string, preset: Partial<Pick<RoPresetModel, 'label' | 'model'>>) {
    return this.post<RoPresetModel>(`${this.API.getMyPreset}/${id}`, preset);
  }

  deletePreset(id: string) {
    return this.delete<RoPresetModel>(`${this.API.getMyPreset}/${id}`);
  }

  sharePreset(id: string, body: { publishName: string }) {
    return this.post<PresetWithTagsModel>(`${this.API.getMyPreset}/${id}/publish`, body);
  }

  unsharePreset(id: string) {
    return this.delete<Omit<RoPresetModel, 'model'>>(`${this.API.getMyPreset}/${id}/unpublish`);
  }

  addPresetTags(id: string, body: BulkOperationRequest) {
    return this.post<PresetWithTagsModel>(`${this.API.getMyPreset}/${id}/tags`, body);
  }

  removePresetTag(params: { presetId: string; tagId: string }) {
    const { presetId, tagId } = params;

    return this.delete<Omit<RoPresetModel, 'model'>>(`${this.API.getMyPreset}/${presetId}/tags/${tagId}`);
  }

  likePresetTags(tagId: string) {
    return this.post<LikeTagResponse>(`${this.API.likePresetTags}/${tagId}/like`, {});
  }

  unlikePresetTag(tagId: string) {
    return this.delete<LikeTagResponse>(`${this.API.likePresetTags}/${tagId}/unlike`);
  }

  getPublishPresets(params: { classId: number; tagName: string; skip: number; take: number }) {
    const { classId, tagName, skip, take } = params;
    return this.get<PublishPresetsReponse>(
      `${this.API.sharedPresets}/${classId}/${tagName}?skip=${skip || 0}&take=${take || 1}`,
    );
  }
}
