import MongoDatabase from '../../../shared/mongodb'
import { Product, ProductOrder } from '../../../shared/types'
import * as constants from '../../../shared/constants'
import { ulid } from 'ulid'

export const asyncCreateProduct = async (product: Product): Promise<Product> => {
	const client = await MongoDatabase.connect();

	product.id = ulid();
	product.deleted = false;

	const result = await client
		.db("db")
		.collection(constants.COLLECTION_PRODUCTS)
		.insertOne(product);

	if (result.result.ok != 1) {
		throw new Error('Insert operation failed');
	}

	return product;
}

export const asyncProductsList = async (): Promise<Product[]> => {
	const client = await MongoDatabase.connect();
	const products = await client
		.db('db')
		.collection(constants.COLLECTION_PRODUCTS)
		.find({ deleted: false }, { projection: { _id: 0 } })
		.sort({ date: 1 }) //Decrescente
		.toArray();
	//TODO- LIMIT/SKIP --> PAGINAZIONE

	return products
}

export const asyncGetProduct = async (productId: string): Promise<Product> => {
	const client = await MongoDatabase.connect();

	let data = await client
		.db('db')
		.collection(constants.COLLECTION_PRODUCTS)
		.findOne({ id: productId, deleted: false }, { projection: { _id: 0 } });

	return data
}

export const asyncUpdateProduct = async (product: Product): Promise<Product> => {
	const client = await MongoDatabase.connect();

	let result = await client
		.db('db')
		.collection(constants.COLLECTION_PRODUCTS)
		.updateOne({ id: product.id }, { $set: product })

	if (result.result.ok != 1) {
		throw new Error('Update operation failed');
	}

	return product
}