<template>
	<div>
		<h6>Prestashop Settings</h6><br>
		<p v-if="error">
			{{errorMessage}}
		</p>
		<table>
			<tr>
				<td>
					<input type="text" v-model="domain" placeholder="prestashop domain"><br>
					<input type="text" v-model="key" placeholder="prestashop api key">
				</td>
			</tr>
			<tr v-if="isWebserviceConfigured">
				<td>
					<button v-on:click="isWebServiceUp">
						Test webservice connexion
					</button>
				</td>	
			</tr>
			<tr v-if="bIsWebserviceUp">
				<td>
					<button v-on:click="loadInventoryFromPrestashop">
						Load inventory from Prestashop
					</button>
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
	
export default {
	created: function () {
		//check if prestashop is properly linked
		
	},
	methods: {
		loadInventoryFromPrestashop: function(){
			console.error('loading from prestashop');
		},
		isWebserviceConfigured: function(){
			return this.key != '' && this.domain !=''
		},
		isWebserviceUp: function(){
			this.prestashopTestConnection()
		}
	},
	data: function () {
		return {
			error: '',
			errorMessage: '',
			bIsWebserviceUp: false,
			key: this.$store.prestashop.key,
			domain: this.$store.prestashop.domain,
		}
	}
}

</script>