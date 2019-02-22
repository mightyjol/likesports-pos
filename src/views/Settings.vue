<template>
	<div>
		<h4>Settings</h4><br>
		<h6>User Settings</h6><br>
		<p>{{test}}</p>
		<p v-if="error">
			{{errorMessage}}
		</p>
		<table>
			<tr>
				<td>Current User</td>
				<td>
					{{user.name}} <br>
					{{user.email}} <br>
					{{user.emailVerified}} <br>
				</td>
			</tr>
			<tr>
				<td>changer de password</td>
				<td>
					<input v-model="oldPassword" type="password" /> <br>
					<input v-model="newPassword1" type="password" /> <br>
					<input v-model="newPassword2" type="password" /> <br>
					<p v-if='errorNewPassword'>
						{{errorNewPasswordMessage}}
					</p>
				</td>
			</tr>
			<tr>
				<td>Log out</td>
				<td>
					<button v-on:click="userLogout">
						Log out
					</button>
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
	
export default {
	created: function () {
		let self = this;

		setInterval(() => {
			self.test ++;
		}, 10);

		const { apiRoutes } = self.getConfig();
		let urlUserData = apiRoutes.base + apiRoutes.user.current;
		
		this.$http.post(urlUserData).then(xhr => {
			if(xhr.status){
				self.user = xhr.data.user;
			}
			else{
				self.error = true;
				self.errorMessage = xhr.errorMessage;
			}
		})
		.catch(e => {
			self.call911(e);
		});
	},
	methods: {
		userLogout: async function(){
			let result = await this.logout();
			if(result === true){
				this.$router.push('/');
			}
			else{
				console.error(result);
				this.error = result.error || false;
				this.errorMessage = result.errorMessage || ''
			}
		}
	},
	data: function () {
		return {
			test: 0,
			error: '',
			errorMessage: '',
			oldPassword: '',
			newPassword1: '',
			newPassword2: '',
			errorNewPassword: false,
			errorNewPasswordMessage: '',
			user: {}
		}
	}
}

</script>