import { Request, Response } from 'express';
import express from 'express';
import { json } from 'body-parser';
import { urlencoded } from "body-parser";
import { Order } from '../../../shared/types'
import corsOptions from "../../../shared/cors";
import {asyncCreateOrder, asyncOrdersList}  from '../../service/base'

const app = express();
const cors = require("cors");

app.use(json());
app.use(json());
app.use(urlencoded());
app.use(cors(corsOptions));

// GET - /orders

app.get(
	'*',
	cors(corsOptions),
	async (req: Request, res: Response): Promise<void> => {
		let ordersList = await asyncOrdersList();
		res.json({
			orders: ordersList.orders,
			nextPageToken: ordersList.nextpageToken,
			totalSize: ordersList.totalSize
		});
	},
);

// POST - /orders
app.post(
	'*',
	cors(corsOptions),
	async (req: Request, res: Response): Promise<void> => {
		const order: Order = req.body;
		let data: Order = await asyncCreateOrder(order);
		res.json(data);
	},
);

export default app;