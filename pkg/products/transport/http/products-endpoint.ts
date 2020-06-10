import { Request, Response } from 'express';
import express from 'express';
import { json } from 'body-parser';
import { urlencoded } from "body-parser";
import { Product } from '../../../shared/types'
import corsOptions from "../../../shared/cors";
import {asyncCreateProduct, asyncProductsList}  from '../../service/base'

const app = express();
const cors = require("cors");

app.use(json());
app.use(json());
app.use(urlencoded());
app.use(cors(corsOptions));

// GET - /product

app.get(
	'*',
	cors(corsOptions),
	async (req: Request, res: Response): Promise<void> => {
		let productsList = await asyncProductsList();
		res.json({
			products: productsList,
		});
	},
);

// POST - /product
app.post(
	'*',
	cors(corsOptions),
	async (req: Request, res: Response): Promise<void> => {
		const product: Product = req.body;
		let data: Product = await asyncCreateProduct(product);
		res.json(data);
	},
);

export default app;