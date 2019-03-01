<template>
	<div>
		<h6>Tags Settings</h6><br>
		brands  <br>
		-------------------- <br>
		<el-table>
		</el-table>
		<br>
		--------------
		<br>
		Category tree <br>
		<el-select 
			v-model="tagsToAdd" 
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
		<el-button @click="addTagsToTree">Add tags to the tree</el-button>
		<br>
		<el-tree
			:data="tagTree"
			node-key="id"
			default-expand-all
			draggable
		>
		</el-tree>
		<br>
		<el-button @click="saveTree">
			Save the current tree 
		</el-button>
	</div>
</template>

<script>
import { Tag } from './../../core/Tag.js'
import Utils from './../../core/Utils.js'

export default {
	async beforeRouteLeave (to, from, next){
		console.log('save')
		await this.saveTree();
		next();
	},
	created: function() {
		this.tagTree = this.addIdDeep(JSON.parse(this.$root.store.settings.tag.tree))
		 
	},
	methods: {
		handleDrop(draggingNode, dropNode, dropType, ev) {
			console.log('tree drop: ', dropNode.label, dropType);
		},
		addTag: function(){ //todo this can be refactored into a vue component? TagSelectorComponent.vue
			let tags = this.tagsToAdd;
			for(let i in tags){
				let tag = new Tag(this.$root.store.user.client, {
					name: this.tagsToAdd[i]
				});
				
				 
				if(!tag.isValid()){
					let index = this.tagsToAdd.indexOf(tag.getRef());
				    if (index > -1) {
				       this.tagsToAdd.splice(index, 1);
				    }
				    this.$notify.error({
			          title: 'Error',
			          message: 'tags need to be at least 2 character long'
			        });
				    return;
				};
				if(this.$root.store.tags[tag.getRef()] != undefined) continue;

				tag.save()
				.then(() => {
					console.log('tag saved')
				})
				.catch(e => {
					this.$notify.error({
			          title: 'Error',
			          message: e
			        });
				})
			}
		},
		addTagsToTree: function() {
			for(let elem of this.tagsToAdd){
				this.tagTree.unshift({
					id: this.index++,
					label: elem
				})
			}
			this.tagsToAdd = [];
		},
		saveTree:async function() {
			let tree = this.tagTree
			let stringTree = JSON.stringify(Utils.removeObjectPropertyDeep(tree, 'id'))
			 
			this.$root.store.user.client.collection('settings').doc('tag').update({
				tree: stringTree
			})
			.then(() => {
				return
			})
			.catch(e => {
				this.$notify.error({
		          	title: 'Error',
		          	message: e
		        });
		        return
			});
		},
		addIdDeep: function(obj){
			if(typeof obj === 'object'){
				obj.id = this.index++ ;
			}
			
			for(let prop in obj) {
				if (typeof obj[prop] === 'object')
					this.addIdDeep(obj[prop]);
			}

			return obj;
		}
	},
	computed: {
		tags: function() {
			return this.$root.store.tags;
		}
	},
	data: function () {
		return {
			tagsToAdd: [],
			tagTree: [],
			index: 0
		}
	}
}

</script>