import { FirestoreComponent } from './FirestoreComponent.js'
import { NameError } from './error/PropsError.js'

export class Product extends FirestoreComponent{
	constructor(client = undefined, init = {}){
		super(client, init);
		/* Adding specific props */
		this.collection = 'product'
	}

	isValid(){
		super.isValid();
		return true;
	}

	create(){
		let props = {
		}

		return super.create(props);
	}

	delete() {
		return super.delete();
	}

	isValidName(name = this.name){
		if(name === undefined) throw new NameError('name is undefined', this.name)
		if(name === null) throw new NameError('name is null', this.name)
		if(name.length < 5)	throw new NameError('Inventory name lenght has to be >= 5', this.name)

		return true
	}

	
	getProductCount() { return this.productCount }
}