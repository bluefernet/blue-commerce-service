import { Request, Response } from 'express';
import express from 'express';
import { json } from 'body-parser';
import { urlencoded } from 'body-parser';
import { Category } from '../../../shared/types'
import { asyncGetCategory, asyncUpdateCategory } from '../../service/base'
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
		let category: Category = req.body;
		const categoryID = <string>req.query.id;
		try {
			category = await asyncUpdateCategory(categoryID, category);
			res.json({
				response: 'response ok',
				categoryUpdate: category
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
		const categoryID = <string>req.query.id;

		try {
			const category = await asyncGetCategory(categoryID);
			res.json({
				category: category
			})
		} catch (error) {
			res.json({
				status: error
			})
		}
	}
)

export default app;