<template>
	<div>
		<div v-if="isLoading">
			<el-progress type="circle" :percentage="loadingProgress" :status="loadingStatus" :show-text="loadingShowText">
				{{loadingText}}
			</el-progress>
		</div>
		<div v-else>
			<br>--------------------<br>
			<button v-on:click="loadInventoryFromPrestashop">
				Load inventory from Prestashop
			</button>
			<p v-if="isAllLoaded">All Imported</p>
			<br>--------------------<br>
		</div>
	</div>	
</template>

<script>
import { Tag } from './../../core/Tag.js';
import { Product } from './../../core/Product.js';

let convert = require('xml-js');

//TODO refactor this pile of shit
//TODO move all the import-heay stuff to the server

export default {
	created: function () {
		 
	},
	methods: {
		loadInventoryFromPrestashop: function(){
			this.isLoading = true
			this.loadingProgress = 0
			this.loadingStatus = 'text'
			this.loadingShowText = true
			this.loadingText = 'initialisation'

			this.languageId = 4
			 
			//load brands
			this.$http.get(this.prestashopBuildBaseUrl() + '/manufacturers?display=[id,name,active]' + '&ws_key=' + 
				this.$root.store.settings.prestashop.key)
			.then(data => {
				let xml = data.body;
				let json = convert.xml2js(xml, {compact: true});

				for(let m of json.prestashop.manufacturers.manufacturer){
					let props = {}
					props.id = m.id._cdata
					props.name =  m.name._cdata
					props.active = m.active._cdata === "1" ? true : false

					this.idToName["Brands"][props.id] = m.name._cdata 
					this.prestashopTags['Brands'][props.name] = props
				}

				this.bIsBrandsLoaded = true;
				console.error('brands loaded')
				this.checkIsAllLoaded()
			})
			.catch(e => {
				console.error(e);
				this.$message({
					type: "error",
					message: e,
					showClose: true
				})
			});


			//load categories
			this.$http.get(this.prestashopBuildBaseUrl() + '/categories?display=full' + '&ws_key=' + 
				this.$root.store.settings.prestashop.key)
			.then(data => {
				let xml = data.body;
				let json = convert.xml2js(xml, {compact: true});

				for(let cat of json.prestashop.categories.category){
					 
					let name = ''
					for(let cat_name of cat.name.language){
						if(cat_name._attributes.id == this.languageId){
							name = cat_name._cdata
						}
					}

					if(name == 'root' || name == 'racine') continue

					let props = {}
					props.id = cat.id._cdata
					props.name = name

					this.idToName["Categories"][props.id] = name
					this.prestashopTags['Categories'][props.name] = props.id
				}

				console.error('categories loaded')
				this.bIsCategoriesLoaded = true;
				this.checkIsAllLoaded()
			})
			.catch(e => {
				console.error(e);
				this.$message({
					type: "error",
					message: e,
					showClose: true
				})
			});


			//load product combination values
			this.$http.get(this.prestashopBuildBaseUrl() + '/product_option_values?display=full' + '&ws_key=' + 
				this.$root.store.settings.prestashop.key)
			.then(data => {
				let xml = data.body;
				let json = convert.xml2js(xml, {compact: true});

				for(let combi of json.prestashop.product_option_values.product_option_value){
					 
					let name = ''
					for(let combi_name of combi.name.language){
						if(combi_name._attributes.id == this.languageId){
							name = combi_name._cdata
						}
					}
					
					let id = combi.id._cdata
					
					this.idToName["Combinations"][id] = name
					this.prestashopCombinations[name] = id
				}
				 
				console.error('combinations loaded')
				this.bIsCombinationsLoaded = true;
				this.checkIsAllLoaded()
			})
			.catch(e => {
				console.error(e);
				this.$message({
					type: "error",
					message: e,
					showClose: true
				})
			});
			

			//load features - step 1
			this.$http.get(this.prestashopBuildBaseUrl() + '/product_features?display=full' + '&ws_key=' + 
				this.$root.store.settings.prestashop.key)
			.then(data => {
				let xml = data.body;
				let json = convert.xml2js(xml, {compact: true});

				for(let feat of json.prestashop.product_features.product_feature){
					let name = ''
					for(let f_name of feat.name.language){
						if(f_name._attributes.id == this.languageId){
							name = f_name._cdata
						}
					}

					this.prestashopTags[name] = {}
					this.idToName["Features"][feat.id._cdata] = name
				}

				//load features - step 2
				this.$http.get(this.prestashopBuildBaseUrl() + '/product_feature_values?display=full' + '&ws_key=' + 
					this.$root.store.settings.prestashop.key)
				.then(data => {
					let xml = data.body;
					let json = convert.xml2js(xml, {compact: true});
				 
					for(let feat of json.prestashop.product_feature_values.product_feature_value){
						let name = ''
						
						for(let f_value of feat.value.language){
							if(f_value._attributes.id == this.languageId){
								name = f_value._cdata
							}
						}

						let set = this.idToName["Features"][feat.id_feature._cdata]
						this.prestashopTags[set][name] = true
					}
					 
					console.error('features loaded')
					this.bIsFeaturesLoaded = true;
					this.checkIsAllLoaded()
				})
				.catch(e => {
					console.error(e);
					this.$message({
						type: "error",
						message: e,
						showClose: true
					})
				});
			})
			.catch(e => {
				console.error(e);
				this.$message({
					type: "error",
					message: e,
					showClose: true
				})
			});
		},
		loadProducts: function(){
			this.$http.get(this.prestashopBuildBaseUrl() + '/products?display=full&limit=10' + '&ws_key=' + 
				this.$root.store.settings.prestashop.key)
			.then(async (data) => {

				this.loadingShowText = true
				this.loadingStatus = undefined
				
				let xml = data.body;
				let json = convert.xml2js(xml, {compact: true});

				let totalProducts = json.prestashop.products.product.length
				let index = 0

				for(let p of json.prestashop.products.product){
					this.loadingProgress = parseFloat(((index++/totalProducts)*100).toFixed(2))
					console.log('importing product ' + index + ' of ' + totalProducts)

					let props = {}
					props.imported = true
					props.importData = {
						from: 'prestashop',
						ref: p.reference._cdata,
						id: p.id._cdata
					}
					props.active = p.active._cdata === "1" ? true : false
					//TODO abstract that
					props.link = 'https://likesports.eu/index.php?controller=product&id_product=' + props.importData.id

					//name
					for(let name of p.meta_title.language){
						if(name._attributes.id == this.languageId){
							props.name = name._cdata
							break;
						}
					}

					//description
					props.description = ''
					for(let desc of p.meta_description.language){
						if(desc._attributes.id == this.languageId){
							props.description = desc._cdata
							break;
						}
					}

					//price
					let price = p.price._cdata || 0
					props.price = {
						pa: 0.00,
						pv: parseFloat(price).toFixed(2),
						pvttc: (price*1.21).toFixed(2)
					}

					//combinations
					let combinations = {}
					let combinationsPromises = []
					
					if(p.associations.combinations.combination != undefined){
						for(let combi of p.associations.combinations.combination){
							combinationsPromises.push(this.$http.get(combi._attributes['xlink:href'] + '?ws_key=' + this.$root.store.settings.prestashop.key ))
						}

						await Promise.all(combinationsPromises)
						.then(data => {
							//loop data
							for(let d of data){
								let xml = d.body;
								let json = convert.xml2js(xml, {compact: true});

								let base = json.prestashop.combination
								combinations[base.id._cdata] = base.associations.product_option_values.product_option_value.id._cdata
							}	
						})
						.catch(e => {
							console.error(e)
						})
					}
					
					props.combinations = combinations

					//stocks
					let stocks = {}
					let stockPromises = []
					
					if(!Array.isArray(p.associations.stock_availables.stock_available)){ 
						stockPromises.push(this.$http.get(p.associations.stock_availables.stock_available._attributes['xlink:href'] + '?ws_key=' + this.$root.store.settings.prestashop.key ))
					}
					else{
						//console.error(p.associations.stock_availables)
						for(let st of p.associations.stock_availables.stock_available){
							stockPromises.push(this.$http.get(st._attributes['xlink:href'] + '?ws_key=' + this.$root.store.settings.prestashop.key ))
						}
					}
					
					await Promise.all(stockPromises)
					.then(data => {
						//loop data
						for(let d of data){
							let xml = d.body;
							let json = convert.xml2js(xml, {compact: true});

							let base = json.prestashop.stock_available

							stocks[base.id_product_attribute._cdata] = {
								combination: base.id_product_attribute._cdata,
								qty: base.quantity._cdata
							}
						}	
					})
					.catch(e => {
						console.error(e)
					})

					props.stocks = stocks

					//merging stocks and combinations
					let qties = {}
					for(let i in stocks){
						let stock = stocks[i]
						let c = parseInt(stock.combination)
						let q = parseInt(stock.qty)

						if(c == 0){
							qties.total = q
							continue
						}

						if(q == 0) continue;
						let id = combinations[c]
						let s = this.idToName["Combinations"][id]
						qties[s] = q
					}
					props.quantity = qties

					//tags
					let tags = {}
					let man_id = p.id_manufacturer._cdata
					if(man_id != "0"){
						tags['brand'] = this.idToName['Brands'][man_id]
					}

					if(!Array.isArray(p.associations.categories.category)){
						let cat_name = this.idToName['Categories'][p.associations.categories.category.id._cdata]
					}
					else{
						for(let cat of p.associations.categories.category){
							let cat_name = this.idToName['Categories'][cat.id._cdata]
							tags['categories'] = cat_name
						}
					}
				 	props.tags = tags

					//images-link
					let images = {}
					if(!Array.isArray(p.associations.images.image)){
						if(p.associations.images.image != undefined){
							images[p.associations.images.image.id._cdata] = p.associations.images.image._attributes["xlink:href"] + '?ws_key=' + this.$root.store.settings.prestashop.image_key 
						}
					}
					else{
						for(let img of p.associations.images.image){
							images[img.id._cdata] = img._attributes["xlink:href"] + '?ws_key=' + this.$root.store.settings.prestashop.image_key
						}
					}
					props.images = images

					this.prestashopProducts[props.importData.id] = props	
				}

				
				this.isAllLoaded = true
				this.cleanAndImport()
			})
			.catch(e => {
				console.error(e);
				this.$message({
					type: "error",
					message: e,
					showClose: true
				})
			});
		},
		checkIsAllLoaded: function(){
			let result = true;
			for(let name of ['Brands','Categories', 'Combinations', 'Features']){
				if(!this['bIs' + name + 'Loaded']){
					result = false;
					break;
				}
			}

			if(result){
				this.loadProducts();
			}
		},
		cleanAndImport: async function(){
			console.error('--------------------')
			console.error(this.prestashopProducts)
			console.error(this.prestashopTags)
			console.error('--------------------')
	
			this.loadingText = "cleaning dataset"
			this.loadingStatus = "text"

			//adding tag sets
			let newSets = []
			for(let i in this.prestashopTags){
				let setName = i
				let ref = this.$root.store.user.client.collection('tag').doc(setName)
				let tags = {}

				for(let t in this.prestashopTags[i]){
					tags[t] = true
				}

				await ref.get()
				.then(doc => {
					//console.error(doc,doc.exists)
					if(!doc.exists){
						newSets.push(ref.set(tags))
					}
				})
				.catch(e => {
					console.error(e)
				})
			}

			await Promise.all(newSets)
			.then(() => {})
			.catch(e => {
				console.error(e)
			})
			
			//adding products
			//TODO match by slug first -> if no match -> add
			let productBatch = this.$db.batch()
			
			for(let i in this.prestashopProducts){
				let product = this.prestashopProducts[i]
				
				let newProduct = new Product(this.$root.store.user.client, product)
				newProduct.addToInventory('prestashop')

				for(let tagSet in product.tags){
					console.error(tagSet)
				}

				let newRef = this.$root.store.user.client.collection('product').doc();
				let props = newProduct.getProps();

				console.error(newRef)
				let quantities = this.prestashopProducts[i].quantity

				productBatch.set(
					newRef, 
					props
					/*, {merge:true}*/
				)

				productBatch.set(
					newRef.collection('inventory').doc('prestashop'), 
					quantities
				)
			}

			 
			productBatch.commit()
			.then(() =>{
				console.error('products saved')
				this.isLoading = false;
			})
			.catch(e => {
				console.error(e)
				this.isLoading = false;
			})
			 
		}
	},
	computed: {
	},
	data: function () {
		return {
			isLoading: false,
			loadingProgress: 0,
			loadingStatus: 'text',
			checkboxes:{
				 
			},
			bIsBrandsLoaded: false,
			bIsFeaturesLoaded: false,
			bIsCategoriesLoaded: false,
			bIsCombinationsLoaded: false,
			isAllLoaded: false,
			languageId: undefined,
			idToName: {
				Brands: {},
				Features: {},
				Categories: {},
				Combinations: {}
			},
			prestashopProducts: {},
			prestashopTags: {
				Brands: {},
				Categories: {}
			},
			prestashopCombinations: {}
		}
	}
}

</script>