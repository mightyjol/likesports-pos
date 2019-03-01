<template>
	<div>
		<h6>Sizes Settings</h6><br>
		<div>
			<el-form @submit.prevent.native="addSet">
				<el-form-item>
					<el-input
						v-model="newSet"
					>
					</el-input>
					<el-button native-type="submit" @click="addSet">
						add a new set
					</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-card v-for="s in sizes" :key="s.ref">
			<div slot="header" class="clearfix">
				<span>{{s.name}}</span>
			</div>
			<el-form @submit.prevent.native="addSize(s.ref)">
				<el-form-item>
					 <el-tag
						:key="size.name"
						v-for="size in s.content"
						closable
						:disable-transitions="false"
						@close="handleClose(s.ref, size)">
						{{size}}
					</el-tag>
					<el-input
					  v-model="inputs[s.ref]"
					  size="mini"
					>
					</el-input>
					<el-button size="small" native-type="submit" @click="addSize(s.ref)">+ New Tag</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import Utils from './../../core/Utils.js'
export default {
	created: function () {
		for(let s in this.sizes){
			this.inputs[this.sizes[s]] = ''
		}
	},
	methods: {
		addSet: function() {
			let name = Utils.capitalize(this.newSet)
			let slug = Utils.slugify(name);
			this.$root.store.user.client.collection('size').doc(slug).set({
				ref: slug,
				name: name,
				content: []
			})
			.then(() => {
				this.newSet = ''
			})
			.catch(e => {
				this.$notify.error({
	          		title: 'Error',
	          		message: e
		        });
			})
		},
		handleClose(set, tag) {
			this.$root.store.user.client.collection('size').doc(set).update({
					content: this.$firebase.firestore.FieldValue.arrayRemove(tag)
				})
				.then(() => {
				})
				.catch(e => {
					this.$notify.error({
		          		title: 'Error',
		          		message: e
		        	});
				})
		},
		addSize(set) {
			let inputValue = this.inputs[set];
			if (inputValue) {
				this.$root.store.user.client.collection('size').doc(set).update({
					content: this.$firebase.firestore.FieldValue.arrayUnion(inputValue)
				})
				.then(() => {
					this.inputs[set] = '';
				})
				.catch(e => {
					this.$notify.error({
		          		title: 'Error',
		          		message: e
		        	});
				})
			}
			
		}
	},
	computed: {
		sizes: function() {
			return this.$root.store.sizes
		}
	},
	data: function () {
		return {
			newSet: '',
			inputs: {}
		}
	}
}

</script>