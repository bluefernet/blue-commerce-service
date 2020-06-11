import {
	asyncCreateOrder as _asyncCreateOrder,
	asyncOrdersList as _asyncOrdersList,
	asyncGetOrder as _asyncGetOrder,
	asyncUpdateOrder as _asyncUpdateOrder
} from '../../store/mongodb'
import { Order, OrdersList, Product } from '../../../shared/types'
import * as constants from '../../../shared/constants'

export const asyncCreateOrder = async (order: Order): Promise<Order> => {
	if (order) {
		let resultOrder = await _asyncCreateOrder(order)
		return resultOrder
	} else {
		throw new Error('Order Object is not defined correctly');
	}
}

export const asyncOrdersList = async (): Promise<OrdersList> => {
	const ordersList: OrdersList = await _asyncOrdersList();
	if (ordersList) {
		return ordersList
	} else {
		throw new Error('There is no List of orders specified');
	}
}

export const asyncGetOrder =
	async (orderId: string): Promise<Order> => {

		let order: Order = await _asyncGetOrder(orderId)
		if (order) {
			return order
		} else {
			throw new Error('There is no order with the specified id');
		}

	}

export const asyncUpdateOrder =
	async (orderId: string, order: Order): Promise<Order> => {
		if (orderId != order.id && order.id != null && order.id != '') {
			throw new Error
			('You cannot modify the id, you are trying to update a different record');
		}

		if (String(order.deleted) == 'true') {
			order.deleted = true
		} else {
			if (String(order.deleted) == 'false') {
				order.deleted = false
			} else {
				throw new Error('deleted - Boolean value not correct');
			}
		}

		let data: Order = await _asyncUpdateOrder(order)
		return data
	}

export const asyncGetOrderProducts = async(orderId: string): Promise<Product[]> => {
	const products : Product[] = await asyncGetOrderProducts(orderId)
	return products
}