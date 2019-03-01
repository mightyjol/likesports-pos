import Utils from './Utils.js'

export class Tag{
	constructor(client = undefined, init = {}){
		if(client === undefined) return undefined;

		this.client = client; 
		this.name = init.name.charAt(0).toUpperCase() + init.name.substr(1) || undefined; 
		this.priority = init.priority || 0;

		this.collection = 'tag'
		return this
	}

	isValid(){
		if( this.client === undefined){
			return false;
		}

		if( 
			this.name === undefined || 
			this.name === null ||
			this.name.length < 2
		){
			return false;
		}
		
		
		if( this.priority < 0 || this.priority > 50 ){
			return false;
		}

		return true;
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

	setName(name = undefined){
		this.name = name;
	}

	getName(){
		return this.name;
	}

	getRef(){
		let name = this.name;
		if( name === undefined ) return undefined;
		return Utils.slugify(name)
	}
}