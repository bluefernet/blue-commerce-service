import { Request, Response } from 'express';
import express from 'express';
import { json } from 'body-parser';
import { urlencoded } from "body-parser";
import { User } from '../../../shared/types'
import corsOptions from "../../../shared/cors";
import {asyncUsersList, asyncCreateUser}  from '../../service/base'

const app = express();
const cors = require("cors");

app.use(json());
app.use(json());
app.use(urlencoded());
app.use(cors(corsOptions));

// GET - /user

app.get(
	'*',
	cors(corsOptions),
	async (req: Request, res: Response): Promise<void> => {
		let usersList = await asyncUsersList();
		res.json({
			users: usersList
		});
	},
);

// POST - /user
app.post(
	'*',
	cors(corsOptions),
	async (req: Request, res: Response): Promise<void> => {
		const user: User = req.body;
		let data: User = await asyncCreateUser(user);
		res.json(data);
	},
);

export default app;