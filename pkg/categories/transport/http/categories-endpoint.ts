import { Request, Response } from 'express';
import express from 'express';
import { json } from 'body-parser';
import { urlencoded } from "body-parser";
import {
	asyncCategorysList,
	asyncCreateCategory
} from '../../service/base';
import { Category } from '../../../shared/types'
import corsOptions from "../../../shared/cors";
import { asyncCategoriesList } from '../../store/mongodb';

const app = express();
const cors = require("cors");

app.use(json());
app.use(json());
app.use(urlencoded());
app.use(cors(corsOptions));

// POST - /tasks

app.get(
	'*',
	cors(corsOptions),
	async (req: Request, res: Response): Promise<void> => {
		let categoriesList = await asyncCategoriesList();
		res.json({
			categories: categoriesList
		});
	},
);

app.post(
	'*',
	cors(corsOptions),
	async (req: Request, res: Response): Promise<void> => {
		const category: Category = req.body;
		let data: Category = await asyncCreateCategory(category);
		res.json(data);
	},
);

export default app;