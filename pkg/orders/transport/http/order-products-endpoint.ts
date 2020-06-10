import { Request, Response } from 'express';
import express from 'express';
import { json } from 'body-parser';
import { urlencoded } from 'body-parser';
import corsOptions from '../../../shared/cors';

const app = express();
const cors = require("cors");

app.use(json());
app.use(urlencoded());
app.use(cors(corsOptions))

app.get(
	'*',
	cors(corsOptions),
	async (req: Request, res: Response): Promise<void> => {
		//TODO
		//const ???? = <string>req.query.????;

		try {
			res.json({
			})
		} catch (error) {
			res.json({
				error: error.message
			})
		}

	}
)

export default app;