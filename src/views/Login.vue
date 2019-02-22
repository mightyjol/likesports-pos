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
			
			//check if email is right
			const email = this.email;
			//check if password is right
			const password = this.password;

			let result = await this.login(email, password);
			if(result === true){
				this.$router.push('/');
			}
			else{
				console.error(result);
				this.error = result.error || false;
				this.errorMessage = result.errorMessage || ''
			}
		}
	}
}

</script>