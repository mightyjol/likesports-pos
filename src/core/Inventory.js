import { FirestoreComponent } from './FirestoreComponent.js'
import { NameError } from './error/PropsError.js'

export class Inventory extends FirestoreComponent{
	constructor(client = undefined, init = {}){
		super(client, init);
		/* Adding specific props */
		this.collection = 'inventory'
		this.productCount = init.productCount || 0
	}

	create(){
		let props = {
			productCount: 0
		}

		return super.create(props);
	}

	delete() {
		//move all products to another inventory?
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