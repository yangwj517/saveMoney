/**
 * 攒钱记账 - 分类服务
 */

import api, { unwrap } from './api';
import { getDefaultCategories } from '@/constants/defaultCategories';

export interface CategoryCreateParams {
  name: string;
  icon?: string;
  color?: string;
  type: string;
  bookType: string;
  parentId?: string;
  order?: number;
}

export interface CategoryUpdateParams {
  name?: string;
  icon?: string;
  color?: string;
  order?: number;
}

/** 获取分类列表 - 如果后端无数据，返回默认分类 */
export async function getCategories(bookType: string, type?: string) {
  try {
    const result = await unwrap<any[]>(
      api.get('/categories', { params: { bookType, type } })
    );
    // 如果后端返回数据，使用后端数据
    if (result && result.length > 0) {
      return result;
    }
    // 否则返回默认分类
    return getDefaultCategories(bookType, type);
  } catch {
    // 请求失败时返回默认分类
    return getDefaultCategories(bookType, type);
  }
}

/** 创建分类 */
export async function createCategory(data: CategoryCreateParams) {
  return unwrap<any>(api.post('/categories', data));
}

/** 更新分类 */
export async function updateCategory(id: string, data: CategoryUpdateParams) {
  return unwrap<any>(api.put(`/categories/${id}`, data));
}

/** 删除分类 */
export async function deleteCategory(id: string) {
  return unwrap<void>(api.delete(`/categories/${id}`));
}

