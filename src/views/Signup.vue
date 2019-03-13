<template>
	<el-row id="login" type="flex" align="middle" justify="center">
		<el-col class="loginContainer">
			<el-card>
				<div slot="header">
					<span>Nouveau Compte</span>
				</div>
				<div>
					<el-form :model="signupForm" @submit.prevent.native="checkData">
						<el-form-item label="nom de la marque/du magasin">
							<el-input v-model="signupForm.client" type="text"></el-input>
						</el-form-item>
						<el-form-item label="email">
							<el-input v-model="signupForm.email" type="email"></el-input>
						</el-form-item>
						<el-form-item label="password">
				    		<el-input v-model="signupForm.password" type="password"></el-input>
				    	</el-form-item>
				    	<el-form-item label="password confirmation">
				    		<el-input v-model="signupForm.passwordbis" type="password"></el-input>
				    	</el-form-item>
				    	<el-form-item label="pays">
				    		<el-select v-model="signupForm.country">
				    			<el-option  v-for="country in countries"
							      	:key="country.code"
							      	:label="country.name"
							     	:value="country.code"
						      	>
				    			</el-option>
				    		</el-select>
				    	</el-form-item>
				    	<el-form-item>
					    	<el-button type="primary" :loading="signupProcess" native-type="submit" @click="checkData">
					    		S'inscrire
					    	</el-button>
					    </el-form-item>
			    	</el-form>
				</div>	 
			</el-card>
			<router-link :to="{ name:'login' }">
				<span class="link">Je souhaite me connecter</span>
			</router-link>   
		</el-col>
	</el-row>
   
</template>

<script>
import Utils from './../core/Utils.js'

export default {
	data: () => {
		return {
			signupForm: {
				client: 'test',
				email: 'test@gmail.com',
				password: 'testing',
				passwordbis: 'testing'
			},
			signupProcess: false,
			countries: [
				{
					name: "Belgique",
					code: "BE"
				}
			]
		}
	},
	methods: {
		checkData: async function(e) {	
			e.preventDefault();	
			this.signupProcess = true;
			
			let slug = Utils.slugify(this.signupForm.client);

			this.$http.post(this.$root.api.base + this.$root.api.security.user.create, this.signupForm)
			.then(() =>{
				this.signupProcess = false
		 		this.$router.replace({ name:'login', params:{new_account: true}})
			})
			.catch(e => {
				this.signupProcess = false
				this.$message({
		          showClose: true,
		          message: e,
		          type: 'error'
		        })
			})
		}
	}
}

</script>