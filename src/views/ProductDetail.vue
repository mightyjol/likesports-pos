<template>
	<div id="productDetail">
		<el-form :model="product" @submit.prevent.native="">
			<h4>{{title}}</h4><br>
			<button @click='save()'>
				save
			</button>
			<button @click='save(true)'>
				add another
			</button>
			<button>
				copy
			</button>
			<router-link :to="{ name:'products' }">
				<button>
					go back
				</button>
			</router-link>
			<ReferenceField v-model="product.ref" v-if="this.ref == 'new'"/> <br>
			<el-tabs>
				<el-tab-pane label="General">
					<br>----------<br>
					metadata <br>
					active <input type="checkbox" v-model="product.metadata.active"><br>
					online <input type="checkbox" v-model="product.metadata.online"><br>
					isPartOfPack <input type="checkbox" v-model="product.metadata.isPartOfPack"><br>
					name <input type="text" v-model="product.metadata.name" placeholder="description"><br>
					description <textarea v-model="product.metadata.description" placeholder="description"></textarea><br>
					<br>----------<br>
					prix <br>
					<div v-if="false">
						Prix achat <input type="number" step="0.01" v-model="product.price.pa"><br>
						Prix vente ttc <input type="number" step="0.01" v-model="product.price.pvttc"><br>
					</div>
				
					<br>----------<br>
					Categorisation and tagging <br>
					<div v-if="false">
						<el-select 
							v-model="product.manufacturer" 
							filterable
							clearable
							allow-create
							default-first-option
							@change="addManufacturer" 
							placeholder="Brand/Manufacturer"
						>
						    <el-option
								v-for="m in manufacturers"
								:key="m.ref"
								:label="m.name"
								:value="m.ref"
							>
						    </el-option>
					  	</el-select>

						//tags + new tags <br>
						<el-select 
							v-model="product.tags" 
							multiple
			    			filterable
			    			allow-create 
			    			default-first-option
			    			@change="addTag" 
							placeholder="tags"
						>
							<el-option
								v-for="t in tags"
								:key="t.ref"
								:label="t.name"
								:value="t.ref"
							>
						    </el-option>
						</el-select>
					</div>
				</el-tab-pane> 
				<el-tab-pane label="Barcodes">
					<el-select v-model="product.size_type">
						<el-option
							v-for="s in sizes"
							:key="s.ref"
							:label="s.name"
							:value="s.ref"
						>
						</el-option>
					</el-select>
					<div v-if="product.size_type != null">
						Codes barres <br>
						<el-form @submit.prevent.native="addBarcode">
							<el-form-item>
								Add a barcode
								<el-select v-model="newBarcodeSize" filterable default-first-option>
									<el-option
										v-for="s in availableSizes"
										:key="s.name"
										:label="s.label"
										:value="s.name"
									>
									</el-option>
								</el-select>
								<el-input v-model="newBarcode"></el-input>
								<el-button native-type="submit" type="primary">
									Add a new barcode
								</el-button>
							</el-form-item>
						</el-form>
						<el-table
							:data="barcodes"
						>
							<el-table-column
								prop="name"
								label="Size"
							>
							</el-table-column>
							<el-table-column
								prop="codes"
								label="Codes"
							>	
								<template slot-scope="scope">
									<span v-for="(c, index) in scope.row.codes">
										{{c}} <span v-if="index != scope.row.codes.length - 1">|</span>
									</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-tab-pane>
				<el-tab-pane label="Images">
					simple upload <br>
					<el-upload
						ref="upload"
						action=""
						:auto-upload="false"
						drag
					>
						<div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
					</el-upload>
					<br>
					<el-button size="small" type="success" @click="uploadImage">upload to server</el-button>
				</el-tab-pane>
				<el-tab-pane label="Stock">
					simple upload <br>

				</el-tab-pane>
			</el-tabs> 
		</el-form>
	</div>
</template>

<script>
import ReferenceField from './../components/product/ReferenceField.vue'
import Utils from './../core/Utils.js'

// TODO refactor product into a repository 
// TODO refactor inventory into a repository
// TODO refactor tags into a repository
// TODO refactor manufacturers into a repository

export default {
	components: {
		'ReferenceField': ReferenceField
	},
	created: function(){
		 
	 
	},
	async beforeRouteLeave (to, from, next){
		console.log('save')
		await this.save();
		next();
	},
	computed: {
		isNew: function(){
			return this.$route.params.ref == 'new'
		},
		product: function() {
			return this.$root.store.products[this.ref];
		},
		barcodes: function(){
			let codes = [];
			for( let c in this.$root.store.products[this.ref].barcodes ){
				codes.push({
					name: c,
					codes: this.$root.store.products[this.ref].barcodes[c].codes
				})
			}

			return codes;
		},
		manufacturers: function(){
			return this.$root.store.manufacturers;
		},
		tags: function() {
			return this.$root.store.tags;
		},
		sizes: function() {
			return this.$root.store.sizes;
		},
		availableSizes: function(){
			let result = [];
			if( !this.product.size_type ) return [];
			for( let i of this.sizes[this.product.size_type].content ){
				result.push({
					label: i,
					name: i
				})
			}
			return result;
		}
	},
	methods: { 
		save: async function(reset = false){
			if(this.isNew){
				if(this.product.ref == '' || this.$root.store.products[this.product.ref] != undefined) return;
				let product = this.product;
				let slug = this.slugify(this.product.ref);

				product.slug = slug;

				let timestamp = this.$firebase.firestore.FieldValue.serverTimestamp();
				product.date_created = timestamp;
				product.date_last_update = timestamp;

				await this.$root.store.user.client.collection('product').doc(slug).set(product)
				.then(() => {
					if(reset){
						this.$router.go();
					}
				})
				.catch(e => {
					console.error(e);
					this.$root.store.failed[this.product.ref] = {
						type: 'product',
						data: this.product
					}
					this.errorMessage = e
				})
			}
			else{
				//TODO case where you change the product ref !!!!!

				if(this.$root.store.products[this.product.ref] == undefined) {
					return;
				}
				else{
					console.log('updating product', this.ref)
					let timestamp = this.$firebase.firestore.FieldValue.serverTimestamp();
					this.product.date_last_update = timestamp;

					await this.$root.store.user.client.collection('product').doc(this.ref).update(this.product)
					.then(() => {
						if(reset){
							this.$router.push({name:'productDetail', params: {ref:'new'}})
						}
					})
					.catch(e => {
						console.error(e);
						this.$root.store.failed[this.product.ref] = {
							type: 'product',
							data: this.product
						}
						this.errorMessage = e
					})
				}
			}
		},
		addManufacturer: function() {

			let name = this.product.manufacturer;
			if( name === undefined ) return;

			let slug = this.slugify(name);

			//isValidManufacturer
			if(name.length < 4) return;
			if(this.$root.store.manufacturers[slug] != undefined) return;

			console.log('adding a manufacturer')
			name = name.charAt(0).toUpperCase() + name.substr(1);

			let m = {
				ref: slug,
				name: name,
				product_qty: 0
			}

			this.$root.store.user.client.collection('manufacturer').doc(slug).set(m)
			.then(() => {
				this.product.manufacturer = slug;
			})
			.catch(e => {
				this.$notify.error({
		          title: 'Error',
		          message: e
		        });
			})
		},
		addTag: function(){
			let tags = this.product.tags;

			for(let i in tags){
				let name = this.product.tags[i];
				let slug = this.slugify(name);

				//isValidTag
				if(name.length < 2) return;
				if(this.$root.store.tags[slug] != undefined) continue;

				console.log('adding a tag')
				name = name.charAt(0).toUpperCase() + name.substr(1);

				let t = {
					name: name,
					ref: slug,
					priority: 0
				}

				this.$root.store.user.client.collection('tag').doc(slug).set(t)
				.then(() => {
					this.product.tags[i] = name;
				})
				.catch(e => {
					this.$notify.error({
			          title: 'Error',
			          message: e
			        });
				})
			}
		},
		addBarcode: function() {
			let code = this.newBarcode;
			let size = this.newBarcodeSize;

			 
			if(this.product.barcodes[size] == undefined){
				let newValue = {}
				newValue[size] = {
					name: size,
					codes: [code]
				}

				this.product.barcodes = Object.assign({}, newValue)
				return;
			}

			this.product.barcodes[size].codes.push(code)
			this.product.hasBarcode = true;
		},
		removeBarcode: function(size, code) {
			Utils.arrayRemoveByValue(this.product.barcodes[size].codes, code)		 
		},
		uploadImage: function(){

		}
	},
	data: function () {
		return {
			errorMessage: '',
			title: this.isNew ? 'New Product' : this.ref,
			ref: this.$route.params.ref,
			newBarcode: '',
			newBarcodeSize: undefined,
			images: []
		}
	}
}

</script>