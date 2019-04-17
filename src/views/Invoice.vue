<template>
	<el-row id="invoice">
		<el-col>
			<h4>Invoices</h4><br>
			<div v-if="bIsCreatingInvoice">
				<h5>New invoice</h5>
				<el-form :model="invoice">
					 
				</el-form>
				<el-button type="danger" @click="cancelCreateInvoice">
					Cancel
				</el-button>
			</div>
			<div v-else>
				<el-button @click="createInvoice">
					new Invoice
				</el-button>
				<h5>Previous invoices</h5>
				<div> 
					<el-table :data="invoices">
						<el-table-column
							label="Amount"
						>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</el-col>
	</el-row>
</template>

<script>
import { Inventory } from './../core/Inventory.js';

export default { 
	methods: {
		createInvoice: function(){
			this.bIsCreatingInvoice = true;
		},
		cancelCreateInvoice: function(){
			this.bIsCreatingInvoice = false;
		}
	},
	computed: {
		invoices: function(){
			let invoices = []
			
			return invoices;
		}
	},
	data: function () {
		return {
			bIsCreatingInvoice: false
		}
	}
}

</script>