import Utils from './Utils.js'
import { ClientError, CreateError } from './error/RepoError.js'
import { NameError } from './error/PropsError.js'

import firebase from 'firebase'

export class FirestoreComponent{
	constructor(client = undefined, init = {}){
		this.client = client; 
		if(client === undefined) throw new ClientError('client is undefined');
		
		this.ref = init.ref || undefined;

		this.name = init.name || undefined;
		if(this.name !== undefined) this.name = init.name.charAt(0).toUpperCase() + init.name.substr(1)
		this.isValidName()

		this.slug = Utils.slugify(this.name);
		this.collection = undefined;
	}
 	
 	isValid(){
 		if( this.client === undefined){
			throw new ClientError('client is undefined')
		}

		if(this.isValidName(this.name)){
			throw new NameError('name property is not valid', this.name)
		}

		return true
 	}

 	create(props){
		if(!this.isValid()) throw new CreateError(this.collection + ' object is invalid:', this);

		let fullProps = this.getProps(props)
		return this.client.collection(this.collection).doc(slug).set(fullProps);
	}

	delete(){
		this.isValidName()
		return this.client.collection(this.collection).doc(this.slug).delete()
	}

	setName(name = undefined){
		if(name === undefined || name === null) return;
		this.name = name;
	}

	getName(){
		return this.name;
	}

	isValidName(name = this.name){
		if(name === undefined) throw new NameError('name property is invalid:', this.name)
		if(name === null) throw new NameError('name property is invalid:', this.name)
		if(name.length < 3) throw new NameError('name property is too short (min 3):', this.name)
		
		return true;
	}

	getRef(){
		if(this.ref !== undefined) return this.ref;
		return Utils.slugify(this.name)
	}

	getProps(props = {}){
		props.ref = this.getRef()
		props.name = this.name
		props.slug = this.slug

		props.date_created = firebase.firestore.FieldValue.serverTimestamp()
		props.date_last_update = firebase.firestore.FieldValue.serverTimestamp()

		return props;
	}
}