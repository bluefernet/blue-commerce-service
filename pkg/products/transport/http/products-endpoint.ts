import { Request, Response } from 'express';
import express from 'express';
import { json } from 'body-parser';
import { urlencoded } from "body-parser";
import { Product, ProductsList } from '../../../shared/types'
import corsOptions from "../../../shared/cors";
import { asyncCreateProduct, asyncProductsList } from '../../service/base'
import { stringify } from 'querystring';
import { privateDecrypt } from 'crypto';

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
		let pageSize: number | undefined= parseInt(req.query.page_size as string);
		let pageToken: string = req.query.page_token as string;
		let category: string = req.query.location as string;
		let name: string = req.query.name as string;
		console.log('GET - products - params ' + pageSize + pageToken + category + name)
		if (name === undefined || name === null || name == undefined || name == null) {
			name = "";
		}
		if (category === undefined || category === null || category == undefined || category == null) {
			category = "";
		}
		if (Number.isNaN(pageSize) || pageSize == undefined) {
			pageSize = 0;
		}
		if (
			pageToken === undefined ||
			pageToken === null ||
			pageToken === "" ||
			pageToken == null
		) {
			pageToken = "0";
		} else {
			pageToken = Buffer.from(pageToken, "base64").toString();
		}

		let productsList: ProductsList = await asyncProductsList(pageSize, pageToken, category, name);
		res.json({
			products: productsList.products,
			nextPageToken: productsList.nextPageToken,
			totalSize: productsList.totalSize
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