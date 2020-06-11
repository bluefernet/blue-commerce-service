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
	let collectionLength = 0;

	if (nameProduct != "" && nameProduct != null && nameProduct != undefined && category != "" && category != null && category != undefined) {
		console.log('filter name and category ' + nameProduct + category)
		collectionLength = await client
			.db("db")
			.collection(constants.COLLECTION_PRODUCTS)
			.find({ deleted: false, name: { $regex: new RegExp(nameProduct), $options: 'i' }, category: { $regex: new RegExp(category), $options: 'i' } })
			.count();
	} else {
		if (nameProduct != "" && nameProduct != null && nameProduct != undefined) {
			console.log('filter only name ' + nameProduct + category)
			collectionLength = await client
				.db("db")
				.collection(constants.COLLECTION_PRODUCTS)
				.find({ deleted: false, name: { $regex: new RegExp(nameProduct), $options: 'i' } })
				.count();
		}
		else {
			if (category != "" && category != null && category != undefined) {
				console.log('filter only category ' + category)
				collectionLength = await client
					.db("db")
					.collection(constants.COLLECTION_PRODUCTS)
					.find({ deleted: false, category: { $regex: new RegExp(category), $options: 'i' } })
					.count();
			}
			else {
				console.log('no filter ' + nameProduct + category)
				collectionLength = await client
					.db("db")
					.collection(constants.COLLECTION_PRODUCTS)
					.find({ deleted: false })
					.count();
			}
		}
	}

	let limit: number = pageSize;
	let skip: number = Number(pageToken) * pageSize;

	if (pageToken != 0) {
		const calculateLimit = (pageToken + 1) * pageSize;
		if (calculateLimit > collectionLength) {
			limit = collectionLength - pageToken * pageSize;
		}
	}

	let products = [
	];

	if (nameProduct != "" && nameProduct != null && nameProduct != undefined && category != "" && category != null && category != undefined) {
		console.log('filter name and category ' + nameProduct + category)
		products = await client
			.db('db')
			.collection(constants.COLLECTION_PRODUCTS)
			.find({ deleted: false, name: { $regex: new RegExp(nameProduct), $options: 'i' }, category: { $regex: new RegExp(category), $options: 'i' } }, { projection: { _id: 0 } })
			.limit(limit)
			.skip(skip)
			.toArray();
	} else {
		if (nameProduct != "" && nameProduct != null && nameProduct != undefined) {
			console.log('filter only name ' + nameProduct + category)
			products = await client
				.db('db')
				.collection(constants.COLLECTION_PRODUCTS)
				.find({ deleted: false, name: { $regex: new RegExp(nameProduct), $options: 'i' } }, { projection: { _id: 0 } })
				.limit(limit)
				.skip(skip)
				.toArray();
		}
		else {
			if (category != "" && category != null && category != undefined) {
				console.log('filter only category ' + nameProduct + category)
				collectionLength = await client
					.db("db")
					.collection(constants.COLLECTION_PRODUCTS)
					.find({ deleted: false, category: { $regex: new RegExp(category), $options: 'i' } }, { projection: { _id: 0 } })
					.count();
			}
			else {
				console.log('no filter ' + nameProduct + category)
				products = await client
					.db('db')
					.collection(constants.COLLECTION_PRODUCTS)
					.find({ deleted: false }, { projection: { _id: 0 } })
					.limit(limit)
					.skip(skip)
					.toArray();
			}
		}
	}

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