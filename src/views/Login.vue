<template>
    <h1>
    	Login <br>
    	<input v-model="email" type="email" name="email" placeholder="email"> <br>
    	<input v-model="password" type="password" name="password"> <br>
    	<button v-on:click="checkData">
    		Se connecter
    	</button>
    	<p v-if='error'>
    		{{errorMessage}}
    	</p>
    </h1>
</template>

<script>
export default {
	data: () => {
		return {
			email: 'jerome.hanke@gmail.com',
			password: 'testing',
			error: false,
			errorMessage: 'undefined'
		}
	},
	methods: {
		checkData: async function() {
			//reset error
			this.error = false;
			this.errorMessage = false;
			
			const email = this.email;
			const password = this.password;

			let result = await this.login(email, password);
			if(result !== true){
				this.error = true;
				this.errorMessage = result.error || ''
			}
		}
	}
}

</script>