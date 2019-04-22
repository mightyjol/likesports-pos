import Utils from './Utils.js'
import { ClientError, CreateError } from './error/RepoError.js'
import { RefError, NameError } from './error/PropsError.js'

import firebase from 'firebase'

export class FirestoreComponent{
	constructor(client = undefined, init = {}){
		this.client = client; 
		if(client === undefined) throw new ClientError('client is undefined');
		
		this.name = ''
		this.slug = ''
		this.imported = false
		this.importData = {}

		this.setName(init.name);
		this.setRef(init.ref)
		this.setImported(init.imported)
		this.setImportData(init.importData)

		this.collection = undefined;
	}
 	
 	isValid(){
 		if( this.client === undefined){
			throw new ClientError('client is undefined')
		}

		this.isValidName(this.name)
		return true
 	}

 	create(props){
		if(!this.isValid()) throw new CreateError(this.collection + ' object is invalid:', this);

		let fullProps = this.getProps(props);
		let promise =  this.client.collection(this.collection).add(fullProps);
		
		promise
		.then(doc => {
			this.setRef(doc.id)
		})
		.catch(e => {
			//TODO find a way to resolve this gracefully
			console.error(e)
		})

		return promise;
	}

	delete(){
		this.isValidName()
		return this.client.collection(this.collection).doc(this.slug).delete()
	}

	setName(name = undefined){
		if(name === undefined || name === null) return;
		this.name = name.charAt(0).toUpperCase() + name.substr(1)
		this.slug = Utils.slugify(this.name);

		return this.isValidName()
	}

	getName(){
		return this.name;
	}

	isValidName(name = this.name){
		if(name === undefined) throw new NameError('name property is invalid:' + this.name)
		if(name === null) throw new NameError('name property is invalid:' + this.name)
		if(name.length < 3) throw new NameError('name property is too short (min 3):' + this.name)
		
		return true;
	}

	setRef(ref = ''){
		if(ref === undefined || ref === null) throw new RefError('ref cannot be undefined|null: ' + this.ref);
		this.ref = ref;
	}

	getRef(){
		return this.ref;
	}

	getSlug(){
		return this.slug;
	}

	setImported(bool = false){
		this.imported = bool == true ? true : false;
	}

	setImportData(d = {}){
		this.importData.from = d.from
		this.importData.id = d.id
		this.importData.ref = d.ref
	}

	getProps(props = {}){
		props.ref = this.getRef()
		props.name = this.getName()
		props.slug = this.slug

		props.date_created = firebase.firestore.FieldValue.serverTimestamp()
		props.date_last_update = firebase.firestore.FieldValue.serverTimestamp()

		return props;
	}
}