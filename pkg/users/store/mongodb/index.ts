import MongoDatabase from '../../../shared/mongodb'
import { User } from '../../../shared/types'
import * as constants from '../../../shared/constants'
import { ulid } from 'ulid'

export const asyncCreateUser = async (user: User): Promise<User> => {
	const client = await MongoDatabase.connect();

	user.id = ulid();
	user.deleted = false;

	const result = await client
		.db("db")
		.collection(constants.COLLECTION_USERS)
		.insertOne(user);

	if (result.result.ok != 1) {
		throw new Error('Insert operation failed');
	}

	return user;
}

export const asyncUsersList = async (): Promise<User[]> => {
	const client = await MongoDatabase.connect();
	const users = await client
		.db('db')
		.collection(constants.COLLECTION_USERS)
		.find({ deleted: false }, { projection: { _id: 0 } })
		.sort({ date: 1 }) //Decrescente
		.toArray();
	//TODO- LIMIT/SKIP --> PAGINAZIONE

	return users
}

export const asyncGetUser = async (userId: string): Promise<User> => {
	const client = await MongoDatabase.connect();

	let data = await client
		.db('db')
		.collection(constants.COLLECTION_USERS)
		.findOne({ id: userId, deleted: false }, { projection: { _id: 0 } });

	return data
}

export const asyncUpdateUser = async (user: User): Promise<User> => {
	const client = await MongoDatabase.connect();

	let result = await client
		.db('db')
		.collection(constants.COLLECTION_USERS)
		.updateOne({ id: user.id }, { $set: user })

	if (result.result.ok != 1) {
		throw new Error('Update operation failed');
	}

	return user
}