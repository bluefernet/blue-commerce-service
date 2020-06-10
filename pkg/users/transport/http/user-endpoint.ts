import { Request, Response } from 'express';
import express from 'express';
import { json } from 'body-parser';
import { urlencoded } from 'body-parser';
import { User } from '../../../shared/types'
import { asyncGetUser, asyncUpdateUser } from '../../service/base'
import corsOptions from '../../../shared/cors';

const app = express();
const cors = require("cors");

app.use(json());
app.use(urlencoded());
app.use(cors(corsOptions))

app.put(
	'*',
	cors(corsOptions),
	async (req: Request, res: Response): Promise<void> => {
		let user: User = req.body;
		const userID = <string>req.query.id;
		try {
			user = await asyncUpdateUser(userID, user);
			res.json({
				response: 'response ok',
				userUpdate: user
			})
		} catch (error) {
			res.json({
				error: error
			})
		}
	}
)

app.get(
	'*',
	cors(corsOptions),
	async (req: Request, res: Response): Promise<void> => {
		const userID = <string>req.query.id;

		try {
			const user = await asyncGetUser(userID);
			res.json({
				user: user
			})
		} catch (error) {
			res.json({
				status: error
			})
		}
	}
)

export default app;