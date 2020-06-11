export interface User {
	id: String;
	name: String;
	surname: String;
	date: String;
	deleted: Boolean;
}

export interface Order {
	id: String;
	deleted: Boolean;
	idUser: String;
	status: String;
	cart: ProductOrder[];
}

export interface ProductOrder {
	idProduct: String;
	quantity: Number;
}

export interface Product {
	id: String;
	name: String;
	description: String;
	idCategory: String;
	amount: Number;
	deleted: Boolean;
}

export interface Category {
	id: String;
	name: String;
	description: String;
	deleted: Boolean;
}

export interface OrdersList {
	orders: Order[],
	nextpageToken: String,
	totalSize: Number
}

export interface ProductsList {
	products: Product[],
	nextPageToken: String,
	totalSize: Number
}

export default app;