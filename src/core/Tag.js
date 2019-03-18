import Utils from './Utils.js'
import { FirestoreComponent } from './FirestoreComponent.js'
import { NameError, PriorityError, SetError } from './error/PropsError.js'

export class Tag extends FirestoreComponent{
	constructor(client = undefined, init = {}){
		super(client, init);
		
		this.priority = init.priority || 0;
		this.set = init.set || undefined;

		this.collection = 'tag'
		return this
	}

	isValid(){	
		if( this.priority < 0 || this.priority > 50 ){
			 throw new PriorityError('priority property is invalid:', this.priority)
		}

		if( this.set === undefined || this.set.length < 3){
			throw new SetError('set property is invalid:', this.priority)
		}

		return super.isValid();
	}

	save(){
		let name = this.name;
		let slug = Utils.slugify(this.name);

		if(!this.isValid()) return false;

		return this.client.collection(this.collection).doc(slug).set({
			ref: slug,
			name: name,
			priority: 0
		});
	}

	isValidName(name = this.name){
		if(name === undefined) throw new NameError('name property is invalid:', this.name)
		if(name === null) throw new NameError('name property is invalid:', this.name)
		if(name.length < 2) throw new NameError('name property is too short (min 2 chars):', this.name)
		
		return true;
	}

	getSet(){
		return this.set;
	}

	getProps(props = {}){
		props.priority = this.priority;

		return super.getProps(props);
	}
}