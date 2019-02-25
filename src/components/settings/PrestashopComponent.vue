<template>
	<div>
		<h6>Prestashop Settings</h6><br>
		<p v-if="errorMessage">
			{{errorMessage}}
		</p>
		<table>
			<tr>
				<td>
					<input type="text" v-model="domain" placeholder="prestashop domain" v-on:input="webserviceUpdate"><br>
					<input type="text" v-model="key" placeholder="prestashop api key" v-on:input="webserviceUpdate">
				</td>
				<td v-if="bIsWebserviceUpdated">
					<button v-on:click="pingAndUpdate()">
						Validate and Update
					</button>
				</td>
			</tr>
			<tr v-if="isWebserviceConfigured">
				<td>
					<button v-on:click="ping(true)">
						Test webservice connexion
					</button>
					<p v-if="bIsPingSuccessfull">
						WebService is up and running
					</p>
				</td>	
			</tr>
			<tr v-if="bIsWebserviceUp">
				<td>
					<PrestashopImportComponent />
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
const convert = require('xml-js');
import PrestashopImportComponent from './PrestashopImportComponent.vue'

export default {
	components: {
		'PrestashopImportComponent' : PrestashopImportComponent
	},
	created: function () {
		//check if prestashop is properly linked
		this.oldDomain = this.domain;
		this.oldKey = this.key;

		if(this.isWebserviceConfigured) this.ping();
	},
	methods: {
		ping: async function(showError = false){
			this.bIsPingSuccessfull = false;
			let result = await this.prestashopPing(this.domain, this.key);

			if(showError && !result){
				this.errorMessage = 'une erreur s\'est produite'
			}
			else if(showError && result){
				this.bIsPingSuccessfull = true;
			}

			this.bIsWebserviceUp = result;
		},
		pingAndUpdate:async function(){
			await this.ping(true);
			if(this.bIsWebserviceUp){
				this.$store.user.client.update({
					"settings.prestashop.domain": domain,
					"settings.prestashop.key": key
				})
				.then(() => {
					this.$store.prestashop.domain = domain;
					this.$store.prestashop.key = key;
					this.bIsWebserviceUp = true;
				})
				.catch(e => {
					console.error(e);
					this.bIsWebserviceUp = false;
					this.errorMessage = e;
				})
			}
		},
		webserviceUpdate: function(){
			if(this.oldDomain != this.domain || this.oldKey != this.key){
				this.bIsWebserviceUpdated = true;
				this.bIsWebserviceUp = false;
			}
			else{
				this.bIsWebserviceUpdated = false;
			 	this.bIsWebserviceUp = false;
			}
		}
	},
	computed: {
		isWebserviceConfigured: function(){
			return this.key != '' && this.domain != '' && !this.bIsWebserviceUpdated;
		}
	},
	data: function () {
		return {
			errorMessage: '',
			bIsWebserviceUp: false,
			bIsWebserviceUpdated: false,
			bIsPingSuccessfull: false,
			key: this.$store.prestashop.key,
			domain: this.$store.prestashop.domain,
			oldKey: '',
			oldDomain: ''
		}
	}
}

</script>