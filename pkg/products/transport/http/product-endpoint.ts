import { Request, Response } from 'express';
import express from 'express';
import { json } from 'body-parser';
import { urlencoded } from 'body-parser';
import { Product } from '../../../shared/types'
import { asyncGetProduct, asyncUpdateProduct } from '../../service/base'
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
		let product: Product = req.body;
		const productID = <string>req.query.id;
		try {
			product = await asyncUpdateProduct(productID, product);
			res.json({
				response: 'response ok',
				productUpdate: product
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
		const productID = <string>req.query.id;

		try {
			const product = await asyncGetProduct(productID);
			res.json({
				product: product
			})
		} catch (error) {
			res.json({
				status: error
			})
		}
	}
)

export default app;