<template>
	<div>
		<h4>{{title}}</h4><br>
		<p v-if="errorMessage">
			{{errorMessage}}
		</p>
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
		<ReferenceField v-model="product.ref"/>
		<br>----------<br>
		metadata <br>
		active <input type="checkbox" v-model="product.metadata.active"><br>
		online <input type="checkbox" v-model="product.metadata.online"><br>
		name <input type="text" v-model="product.metadata.name" placeholder="description"><br>
		description <textarea v-model="product.metadata.description" placeholder="description"></textarea><br>
		<br>----------<br>
		prix <br>
		Prix achat <input type="number" step="0.01" v-model="product.price.pa"><br>
		Prix vente ttc <input type="number" step="0.01" v-model="product.price.pvttc"><br>
	</div>
</template>

<script>
import ReferenceField from './../components/product/ReferenceField.vue'

// TODO refactor product into a repository 
// TODO refactor inventory into a repository

export default {
	components: {
		'ReferenceField': ReferenceField
	},
	created: function(){
		this.ref = this.$route.params.ref;
		this.title = this.isNew ? 'New Product' : this.ref

		if(this.$root.store.products[this.ref] != undefined) {
			console.error('not new')
			this.product = this.$root.store.products[this.ref];
			console.error(this.product)
		}
		else{
			console.error('new');
			this.product = Object.assign({}, this.blankProduct);
		}
	},
	async beforeRouteLeave (to, from, next){
		console.log('save')
		await this.save();
		next();
	},
	computed: {
		isNew: function(){
			return this.$route.params.ref == 'new'
		}
	},
	methods: {
		save: async function(reset = false){
			if(this.product.ref == '' || this.$root.store.products[this.product.ref] != undefined) return
			this.errorMessage = 'Loading'
			if(this.isNew){
				let product = this.product;
				let slug = this.slugify(this.product.ref);

				product.slug = slug;

				let timestamp = this.$firebase.firestore.FieldValue.serverTimestamp();
				product.date_created = timestamp;
				product.date_last_update = timestamp;

				await this.$root.store.user.client.collection('product').doc(slug).set(product)
				.then(() => {
					if(reset){
						this.product = Object.assign({}, this.blankProduct);
						this.errorMessage = ''
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
				console.log('updating product', this.ref)
			}
		}
	},
	data: function () {
		return {
			errorMessage: '',
			title: '',
			ref: '',
			product: {},
			blankProduct: {
				ref: '',
				metadata: {
					name: '',
					description: '',
					active: true,
					online: false
				},
				price: {
					pa: 0.00,
					pvttc: 0.00
				}
			}
		}
	}
}

</script>