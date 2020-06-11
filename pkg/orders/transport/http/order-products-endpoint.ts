import { Request, Response } from 'express';
import express from 'express';
import { json } from 'body-parser';
import { urlencoded } from 'body-parser';
import {asyncGetOrderProducts} from '../../service/base'
import corsOptions from '../../../shared/cors';
import {Product} from '../../../shared/types';

const app = express();
const cors = require("cors");

app.use(json());
app.use(urlencoded());
app.use(cors(corsOptions))

app.get(
	'*',
	cors(corsOptions),
	async (req: Request, res: Response): Promise<void> => {
		const orderId = <string>req.query.id;
		let products: Product[] = await asyncGetOrderProducts(orderId)
		try {
			res.json({
				orderProducts: products
			})
		} catch (error) {
			res.json({
				error: error.message
			})
		}

	}
)

export default app;