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
		let pageSize: number = parseInt(req.params.page_size);
		let pageToken: string = req.params.page_token;
		let category: string = req.params.location;
		let name: string = req.params.name;
		console.log('GET - products - params ' + pageSize + pageToken + category + name)
		if (name === undefined || name === null) {
			name = "";
		}
		if (Number.isNaN(pageSize)) {
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