<template>
	<div>
		<h4>{{ clientName }}</h4>
		<el-row>
			<router-link :to="{ name:'productDetail' , params: { ref: 'new'}}">
				<el-button type="primary">Add new product</el-button>
			</router-link>
			<router-link :to="{ name:'invoice' }">
				<el-button>Invoice management</el-button>
			</router-link>
			<el-button @click="launchPOS">Launch POS mode</el-button>
		</el-row>
		<el-row>
			<h5>Commandes à traiter</h5>
		</el-row>
		<el-table striped :data="commands">
			<el-table-column
				label="email"
			>	
			</el-table-column>
			<el-table-column
				label="adresse"
			>	
			</el-table-column>
			<el-table-column
				label="label"
			>	
				<el-button @click="commandLabel">
					<i class="fas fa-print"></i>
				</el-button>
			</el-table-column>
			<el-table-column
				label="prepare"
			>	
				<el-button @click="commandDetail">
					<i class="far fa-eye"></i>
				</el-button>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	
export default {
	mounted: function () {
	 
	},
	methods: {
		launchPOS: function(){
			console.log("launch pos")
		},
		commandDetail: function(){
			console.log("start command process")
		},
		commandLabel: function(){
			console.log("print labels")
		},

	},
	computed: {
		commands: function(){
			return []
		}	
	},
	data: function () {
		return {
			clientName: this.$root.store.user.client_name
		}
	}
}

</script>