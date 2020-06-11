const corsOptions = {
	origin: [
		"https://blue-commerce-ui.now.sh/"
	],
	methods: [
		"GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"
	],
	allowedHeaders: [
		"Content-Type",
		"Access-Control-Allow-Headers",
		"Authorization",
		"X-Requested-With"
	],
	preflightContinue: false,
	optionsSuccessStatus: 200
};

export default corsOptions;