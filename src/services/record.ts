/**
 * 攒钱记账 - 账单记录服务
 */

import api, { unwrap } from './api';

export interface RecordQueryParams {
  bookType: string;
  type?: string;
  categoryId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export interface RecordCreateParams {
  amount: number;
  type: string;
  categoryId: string;
  accountId: string;
  bookType: string;
  date: string;
  note?: string;
  images?: string[];
}

export interface RecordUpdateParams {
  amount?: number;
  type?: string;
  categoryId?: string;
  accountId?: string;
  date?: string;
  note?: string;
  images?: string[];
}

/** 获取账单列表（分页） */
export async function getRecords(params: RecordQueryParams) {
  return unwrap<any>(api.get('/records', { params }));
}

/** 获取账单详情 */
export async function getRecord(id: string) {
  return unwrap<any>(api.get(`/records/${id}`));
}

/** 创建账单 */
export async function createRecord(data: RecordCreateParams) {
  return unwrap<any>(api.post('/records', data));
}

/** 更新账单 */
export async function updateRecord(id: string, data: RecordUpdateParams) {
  return unwrap<any>(api.put(`/records/${id}`, data));
}

/** 删除账单 */
export async function deleteRecord(id: string) {
  return unwrap<void>(api.delete(`/records/${id}`));
}

/** 上传账单图片 */
export async function uploadRecordImage(file: { uri: string; name: string; type: string }) {
  const formData = new FormData();
  formData.append('file', file as any);
  return unwrap<{ url: string }>(
    api.post('/records/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  );
}

