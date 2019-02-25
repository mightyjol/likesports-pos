<template>
	<div>
		<br>--------------------<br>
			marques <input type="checkbox" v-model:checked="checkboxes.bLoadBrands"> <br>
			produits <input type="checkbox" v-model:checked="checkboxes.bLoadProducts"> <br>
			<button v-on:click="loadInventoryFromPrestashop">
				Load inventory from Prestashop
			</button>
			<p v-if="isAllLoaded">All Imported</p>
		<br>--------------------<br>
	</div>
</template>

<script>
let convert = require('xml-js');
export default {
	created: function () {
		 
	},
	methods: {
		loadInventoryFromPrestashop: function(){
			this.errorMessage = '';

			//nothing to import
			if(!this.checkboxes.bLoadBrands && !this.checkboxes.bLoadProducts){
				console.error('nothing to import');
				this.errorMessage = 'nothing to import';
				return
			}

			//import brands
			if(this.checkboxes.bLoadBrands){
				this.$http.get(this.prestashopBuildBaseUrl() + '/manufacturers?display=[id,name,active]' + '&ws_key=' + 
					this.$root.store.settings.prestashop.key)
				.then(data => {
					let xml = data.body;
					let json = convert.xml2js(xml, {compact: true});
					
					let batch = this.$db.batch();
					let base = this.$root.store.user.client.collection('manufacturer');

					for(let m of json.prestashop.manufacturers.manufacturer){
						console.error(m)
						let id = m.id._cdata
						let name = m.name._cdata
						let active = m.active._cdata === "1" ? true : false; 
						
						batch.set(base.doc(name), {
							id: id,
							name: name,
							active: active
						}, { merge: true })
					}

					batch.commit()
					.then(() => {
    					this.bIsBrandsLoaded = true;
    					this.checkIsAllLoaded()
					})
					.catch(e => {
						this.errorMessage = e
					});
				})
				.catch(e => {
					console.error(e);
					this.errorMessage = e;
				});
			}

			if(this.checkboxes.bLoadProducts){
				this.$http.get(this.prestashopBuildBaseUrl() + '/products?display=full&limit=10' + '&ws_key=' + 
					this.$root.store.settings.prestashop.key)
				.then(data => {
					let xml = data.body;
					let json = convert.xml2js(xml, {compact: true});
					
					let batch = this.$db.batch();
					let base = this.$root.store.user.client.collection('product');

					for(let p of json.prestashop.products.product){
						console.error(p)
						let id = p.id._cdata
						let active = p.active._cdata === "1" ? true : false; 
						let reference = p.reference._cdata;
						
						batch.set(base.doc(reference), {
							id: id,
							reference: reference,
							active: active
						}, { merge: true })	
					}

					batch.commit()
					.then(() => {
    					this.bIsProductsLoaded = true;
    					this.checkIsAllLoaded()
					})
					.catch(e => {
						this.errorMessage = e
					});
				})
				.catch(e => {
					console.error(e);
					this.errorMessage = e;
				});
			}
		},
		checkIsAllLoaded: function(){
			let result = true;
			for(let name of ['Brands','Products']){
				if(this.checkboxes['bLoad' + name] !== this['bIs' + name + 'Loaded']){
					result = false;
					break;
				}
			}
			this.isAllLoaded = result;
		}
	},
	computed: {
	},
	data: function () {
		return {
			checkboxes:{
				bLoadBrands: true,
				bLoadProducts: true,
			},
			bIsBrandsLoaded: false,
			bIsProductsLoaded: false,
			isAllLoaded: false
		}
	}
}

</script>