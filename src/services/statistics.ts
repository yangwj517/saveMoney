/**
 * 攒钱记账 - 统计服务
 */

import api, { unwrap } from './api';

/** 获取统计数据 */
export async function getStatistics(
  bookType: string,
  startDate: string,
  endDate: string,
  type?: string
) {
  return unwrap<any>(
    api.get('/statistics', { params: { bookType, startDate, endDate, type } })
  );
}

/** 获取账簿概览 */
export async function getOverview(bookType: string) {
  return unwrap<any>(api.get('/overview', { params: { bookType } }));
}

