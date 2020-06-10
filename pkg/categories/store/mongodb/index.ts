import MongoDatabase from '../../../shared/mongodb'
import { Category } from '../../../shared/types'
import * as constants from '../../../shared/constants'
import { ulid } from 'ulid'

export const asyncCreateCategory = async (category: Category): Promise<Category> => {
	const client = await MongoDatabase.connect();

	category.id = ulid();
	category.deleted = false;

	const result = await client
		.db("db")
		.collection(constants.COLLECTION_CATEGORIES)
		.insertOne(category);

	if (result.result.ok != 1) {
		throw new Error('Insert operation failed');
	}

	return category;
}

export const asyncCategoriesList = async (): Promise<Category[]> => {
	const client = await MongoDatabase.connect();
	const categories = await client
		.db('db')
		.collection(constants.COLLECTION_CATEGORIES)
		.find({ deleted: false }, { projection: { _id: 0 } })
		.sort({ date: 1 }) //Decrescente
		.toArray();
	//TODO- LIMIT/SKIP --> PAGINAZIONE

	return categories
}

export const asyncGetCategory = async (categoryId: string): Promise<Category> => {
	const client = await MongoDatabase.connect();

	let data = await client
		.db('db')
		.collection(constants.COLLECTION_CATEGORIES)
		.findOne({ id: categoryId, deleted: false }, { projection: { _id: 0 } });

	return data
}

export const asyncUpdateCategory = async (category: Category): Promise<Category> => {
	const client = await MongoDatabase.connect();

	let result = await client
		.db('db')
		.collection(constants.COLLECTION_CATEGORIES)
		.updateOne({ id: category.id }, { $set: category })

	if (result.result.ok != 1) {
		throw new Error('Update operation failed');
	}

	return category
}