import { Request, Response } from 'express';
import express from 'express';
import { json } from 'body-parser';
import { urlencoded } from 'body-parser';
import { Order, OrdersList } from '../../../shared/types'
import { asyncGetOrder, asyncUpdateOrder } from '../../service/base'
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
		let order: Order = req.body;
		const orderID = <string>req.query.id;
		try {
			order = await asyncUpdateOrder(orderID, order);
			res.json({
				response: 'response ok',
				orderUpdate: order
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
		const orderID = <string>req.query.id;

		try {
			const order = await asyncGetOrder(orderID);
			res.json({
				order: order
			})
		} catch (error) {
			res.json({
				status: error
			})
		}
	}
)

export default app;