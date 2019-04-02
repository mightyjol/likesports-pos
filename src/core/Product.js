import { FirestoreComponent } from './FirestoreComponent.js'
import { NameError, ParameterError } from './error/PropsError.js'

export class Product extends FirestoreComponent{
	constructor(client = undefined, init = {}){
		super(client, init);
		/* Adding specific props */
		this.collection = 'product'

		this.size_type = ''
		this.tags = []
		this.images = []
		this.barcode_search = []
		this.barcodes = {}

		this.price = {
			pa: 0.00,
			pv: 0.00,
			pvttc: 0.00
		}

		this.active = true 
		this.description = '' 
		this.link = ''

		this.setPrice(init.price)
		this.setTags(init.tags)
		this.setImages(init.images)
		this.setSizeType(init.size_type)
		this.setActive(init.active)
		this.setDescription(init.active)
		this.setLink(init.link)
	}

	create(props){
		return super.create(props);
	}

	setPrice(price = {}){
		let newPrice = this.price

		if(price.pa != undefined) newPrice.pa = + parseFloat(price.pa).toFixed(2) || 0.00
		if(price.pv != undefined) newPrice.pv = + parseFloat(price.pv).toFixed(2) || 0.00
		if(price.pvttc != undefined) newPrice.pvttc = + parseFloat(price.pvttc).toFixed(2) || 0.00

		this.price = newPrice
	}

	setTags(tags = []){
		if(tags == undefined || tags == null) throw new ParameterError('passed parameter is' + tags)
		for(let i in tags){
			let t = tags[i]
			if(typeof t == "string"){
				if(this.tags.includes(t)) continue
				this.tags.push(t)
			}
		}
	}

	setImages(images = []){
		if(images == undefined || images == null) throw new ParameterError('passed parameter "images" is not valid: ' + images)
		for(let i in images){
			let url = images[i]
			if(typeof url == "string"){
				if(this.images.includes(url)) continue
				this.images.push(url)
			}
		}
	}

	setSizeType(type = ''){
		if(type == undefined){
			this.type = ''
			return
		} 

		if(typeof type != 'string') throw new ParameterError('passed parameter "size_type" is not a string: ' + type)

		this.type = type
	}

	setActive(active = true){
		if(active == undefined || active == null) active = true
		this.active = active == true
	}

	setLink(link = 'undefined'){
		if(link == undefined || link == null) link = true
		this.link = link
	}

	setDescription(desc = ''){
		this.description = desc
	}

	getPrice(){
		return this.price
	}

	getProps(props = {}){
		props.price = this.getPrice()
		props.tags = this.tags
		props.images = this.images
		props.description = this.description
		props.barcodes = this.barcodes
		props.barcode_search = this.barcode_search
		props.active = this.active
		props.size_type = this.size_type
		props.link = this.link

		return super.getProps(props);
	}
}