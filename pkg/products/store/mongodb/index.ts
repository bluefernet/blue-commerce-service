import MongoDatabase from '../../../shared/mongodb'
import { Product, ProductOrder, ProductsList } from '../../../shared/types'
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

export const asyncProductsList = async (
	pageSize: number,
	pageToken: number,
	category: string,
	nameProduct: string
): Promise<ProductsList> => {
	const client = await MongoDatabase.connect();
	
	let query: any = {
		"deleted": "false"
	}
	if (nameProduct != "" && nameProduct != null && nameProduct != undefined) {
		//query += ", name: {$regex: nameProduct, $options: 'i'}"
	}
	if (category != "" && category != null && category != undefined) {
		//query += ", category: {$regex: category, $options: 'i'}"
	}
	console.log(query)
	const collectionLength = await client
		.db("db")
		.collection(constants.COLLECTION_PRODUCTS)
		.find({ deleted: false, name: {$regex: /nameProduct/, $options: 'i'}, category: {$regex: /category/, $options: 'i'} })
		.count();

	let limit: number = pageSize;
	let skip: number = Number(pageToken) * pageSize;

	if (pageToken != 0) {
		const calculateLimit = (pageToken + 1) * pageSize;
		if (calculateLimit > collectionLength) {
			limit = collectionLength - pageToken * pageSize;
		}
	}

	const products = await client
		.db('db')
		.collection(constants.COLLECTION_PRODUCTS)
		.find({ deleted: false, name: {$regex: /nameProduct/, $options: 'i'}, category: {$regex: /category/, $options: 'i'} }, { projection: { _id: 0 } })
		.limit(limit)
		.skip(skip)
		.toArray();

	let _nextPageToken: string = "";
	if (skip + limit < collectionLength && limit != 0) {
		_nextPageToken = "" + (pageToken + 1);
		_nextPageToken = Buffer.from(_nextPageToken).toString("base64");
	}

	console.log(_nextPageToken, collectionLength)

	let productsList: ProductsList = {
		products: products,
		nextPageToken: _nextPageToken,
		totalSize: collectionLength
	};

	return productsList
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