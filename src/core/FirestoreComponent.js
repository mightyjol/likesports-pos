import Utils from './Utils.js'
import { ClientError } from './error/ClientError.js'
import { NameError } from './error/PropsError.js'

import firebase from 'firebase'

export class FirestoreComponent{
	constructor(client = undefined, init = {}){
		this.client = client; 
		if(client === undefined) throw new ClientError('client is undefined');
		
		this.name = init.name.charAt(0).toUpperCase() + init.name.substr(1) || undefined;
		this.isValidName()

		this.slug = Utils.slugify(this.name);
		this.collection = undefined;
	}
 	
 	isValid(){
 		if( this.client === undefined){
			return false;
		}

		if(this.isValidName(this.name)){
			return false;
		}
 	}

 	create(props){
		let name = this.name;
		let slug = Utils.slugify(this.name);

		if(!this.isValid()) return false;

		props.name = name;
		props.slug = slug;
		
		props.date_created = firebase.firestore.FieldValue.serverTimestamp();
		props.date_last_update = firebase.firestore.FieldValue.serverTimestamp()

		return this.client.collection(this.collection).doc(slug).set(props);
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

	//name class? 
	isValidName(name = this.name){
		if(name === undefined) throw new NameError('name property is invalid:', this.name)
		if(name === null) throw new NameError('name property is invalid:', this.name)
		if(name.length < 3) throw new NameError('name property is too short (min 3):', this.name)
		
		return true;
	}

	getRef(){
		let name = this.name;
		return Utils.slugify(name)
	}
}