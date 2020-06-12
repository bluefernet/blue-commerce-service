import {
	asyncCategoriesList as _asyncCategoriesList,
	asyncCreateCategory as _asyncCreateCategory,
	asyncGetCategory as _asyncGetCategory,
	asyncUpdateCategory as _asyncUpdateCategory

} from '../../store/mongodb'
import { Category } from '../../../shared/types'
import * as constants from '../../../shared/constants'

export const asyncCreateCategory = async (category: Category): Promise<Category> => {
	if (category) {
		let resultCategory = await _asyncCreateCategory(category)
		return resultCategory
	} else {
		throw new Error('Category Object is not defined correctly');
	}
}

export const asyncCategorysList = async (): Promise<Category[]> => {
	const categoriesList = await _asyncCategoriesList();
	if (categoriesList) {
		return categoriesList
	} else {
		throw new Error('There is no List of categories specified');
	}
}

export const asyncGetCategory =
	async (categoryId: string): Promise<Category> => {

		let category: Category = await _asyncGetCategory(categoryId)
		if (category) {
			return category
		} else {
			throw new Error('There is no Category with the specified id');
		}

	}

export const asyncUpdateCategory =
	async (categoryID: string, category: Category): Promise<Category> => {
		if (categoryID != category.id && category.id != null && category.id != '') {
			throw new Error
			('You cannot modify the id, you are trying to update a different record');
		}

		if (String(category.deleted) == 'true') {
			category.deleted = true
		} else {
			if (String(category.deleted) == 'false') {
				category.deleted = false
			} else {
				throw new Error('deleted - Boolean value not correct');
			}
		}

		let data: Category = await _asyncUpdateCategory(category)
		return data
	}