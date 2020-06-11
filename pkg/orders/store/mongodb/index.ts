import MongoDatabase from '../../../shared/mongodb'
import { Order, OrdersList, Product, ProductOrder } from '../../../shared/types'
import * as constants from '../../../shared/constants'
import { ulid } from 'ulid'

export const asyncCreateOrder = async (order: Order): Promise<Order> => {
	const client = await MongoDatabase.connect();

	order.id = ulid();
	order.deleted = false;

	const result = await client
		.db("db")
		.collection(constants.COLLECTION_ORDERS)
		.insertOne(order);

	if (result.result.ok != 1) {
		throw new Error('Insert operation failed');
	}

	return order;
}

export const asyncOrdersList = async (): Promise<OrdersList> => {
	const client = await MongoDatabase.connect();
	const orders = await client
		.db('db')
		.collection(constants.COLLECTION_ORDERS)
		.find({ deleted: false }, { projection: { _id: 0 } })
		.toArray();
	//TODO- LIMIT/SKIP --> PAGINAZIONE
	const ordersList: OrdersList = {
		orders: orders,
		nextpageToken: '',
		totalSize: orders.length
	}
	return ordersList
}

export const asyncOrdersStateList =
	async (_state: string): Promise<OrdersList> => {
		const client = await MongoDatabase.connect();
		const orders = await client
			.db('db')
			.collection(constants.COLLECTION_ORDERS)
			.find({ state: _state, deleted: false }, { projection: { _id: 0 } })
			.sort({ date: 1 }) //Crescente
			.toArray();

		if (!orders) {
			throw new Error('No Orders found for the specified state');
		}

		const ordersList: OrdersList = {
			orders: orders,
			nextpageToken: '',
			totalSize: orders.length
		}
		return ordersList
	}

export const asyncGetOrder = async (orderId: string): Promise<Order> => {
	const client = await MongoDatabase.connect();

	let data = await client
		.db('db')
		.collection(constants.COLLECTION_ORDERS)
		.findOne({ id: orderId, deleted: false }, { projection: { _id: 0 } });

	return data
}

export const asyncUpdateOrder = async (order: Order): Promise<Order> => {
	const client = await MongoDatabase.connect();

	let result = await client
		.db('db')
		.collection(constants.COLLECTION_ORDERS)
		.updateOne({ id: order.id }, { $set: order })

	if (result.result.ok != 1) {
		throw new Error('Update operation failed');
	}
	return order
}

export const asyncGetOrderProducts = async (orderId: string): Promise<Product[]> => {
	const client = await MongoDatabase.connect();
	let products: Product[] = [
	];
	let order = <Order>await client
		.db('db')
		.collection(constants.COLLECTION_ORDERS)
		.findOne({ id: orderId })

	let cart: ProductOrder[] = order.cart
	for (let i = 0; i < cart.length; i++) {
		const productOrder: ProductOrder = cart[i];
		let product = <Product>await client
			.db('db')
			.collection(constants.COLLECTION_PRODUCTS)
			.findOne({ id: productOrder.idProduct })
		if (product) {
			products.concat(product)
		}
	}

	return products
}