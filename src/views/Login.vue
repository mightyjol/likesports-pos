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
      	login: function() {

		},
		checkData: function() {
			//reset error
			this.error = false;

			//check if email is right
			const email = this.email;
			//check if password is right
			const password = this.password;

			let { apiRoutes } = this.getConfig();
			let urlLogin = apiRoutes.base + apiRoutes.login;

			//send to login
			this.$http.post(urlLogin, {
				email: email,
				password: password
			})
			.then( data => {
				if(data.status){
					this.$router.push('/');
				}
				else{
					this.error = true;
					this.errorMessage = data.error;
				}
			})
			.catch( e => {
				console.error(e);
				alert(this.call911());
			});
		}
	}
}

</script>