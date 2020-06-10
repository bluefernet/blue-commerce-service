import {
	asyncCreateUser as _asyncCreateUser,
	asyncGetUser as _asyncGetUser,
	asyncUpdateUser as _asyncUpdateUser,
	asyncUsersList as _asyncUsersList
} from '../../store/mongodb'
import { User } from '../../../shared/types'
import * as constants from '../../../shared/constants'

export const asyncCreateUser = async (user: User): Promise<User> => {
	if (user) {
		let resultUser = await _asyncCreateUser(user)
		return resultUser
	} else {
		throw new Error('User Object is not defined correctly');
	}
}

export const asyncUsersList = async (): Promise<User[]> => {
	const usersList = await _asyncUsersList();
	if (usersList) {
		return usersList
	} else {
		throw new Error('There is no List of user specified');
	}
}

export const asyncGetUser =
	async (userId: string): Promise<User> => {

		let user: User = await _asyncGetUser(userId)
		if (user) {
			return user
		} else {
			throw new Error('There is no user with the specified id');
		}

	}

export const asyncUpdateUser =
	async (userID: string, user: User): Promise<User> => {
		if (userID != user.id && user.id != null && user.id != '') {
			throw new Error
			('You cannot modify the id, you are trying to update a different record');
		}

		if (String(user.deleted) == 'true') {
			user.deleted = true
		} else {
			if (String(user.deleted) == 'false') {
				user.deleted = false
			} else {
				throw new Error('deleted - Boolean value not correct');
			}
		}

		let data: User = await _asyncUpdateUser(user)
		return data
    }