import {
	asyncCreateProduct as _asyncCreateProduct,
	asyncProductsList as _asyncProductsList,
	asyncGetProduct as _asyncGetProduct,
	asyncUpdateProduct as _asyncUpdateProduct
} from '../../store/mongodb'
import { Product, ProductOrder, ProductsList } from '../../../shared/types'
import * as constants from '../../../shared/constants'

export const asyncCreateProduct = async (product: Product): Promise<Product> => {
	if (product) {
		let result = await _asyncCreateProduct(product)
		return result
	} else {
		throw new Error('Product Object is not defined correctly');
	}
}

export const asyncProductsList = async (_pageSize: number,
	_pageToken: string,
	_category: string,
	_name: string
): Promise<ProductsList> => {
	const pageToken: number = parseInt(_pageToken);
	const productsList: ProductsList = await _asyncProductsList(_pageSize, pageToken, _category, _name);
	if (productsList.products) {
		return productsList
	} else {
		throw new Error('There is no List of orders specified');
	}
}

export const asyncGetProduct =
	async (productId: string): Promise<Product> => {

		let product: Product = await _asyncGetProduct(productId)
		if (product) {
			return product
		} else {
			throw new Error('There is no product with the specified id');
		}

	}

export const asyncUpdateProduct =
	async (productID: string, product: Product): Promise<Product> => {
		if (productID != product.id && product.id != null && product.id != '') {
			throw new Error
			('You cannot modify the id, you are trying to update a different record');
		}

		if (String(product.deleted) == 'true') {
			product.deleted = true
		} else {
			if (String(product.deleted) == 'false') {
				product.deleted = false
			} else {
				throw new Error('deleted - Boolean value not correct');
			}
		}

		let data: Product = await _asyncUpdateProduct(product)
		return data
	}