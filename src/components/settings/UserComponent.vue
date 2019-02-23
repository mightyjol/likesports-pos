<template>
	<div>
		<h6>User Settings</h6><br>
		<p v-if="error">
			{{errorMessage}}
		</p>
		<table>
			<tr>
				<td>Current User</td>
				<td>
					{{user.email}}
				</td>
			</tr>
			<tr>
				<td>changer de password</td>
				<td>
					<input v-model="newPassword1" type="password" /> <br>
					<input v-model="newPassword2" type="password" /> <br>
					<button v-on:click="userUpdatePassword">
						update password
					</button>
					<p v-if='errorNewPassword'>
						{{errorNewPasswordMessage}}
					</p>
					<p v-if='newPasswordOk'>
						Your password has been updated successfully
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
	created: async function () {
		this.user = await this.getCurrentUserInfo();
	},
	methods: {
		userLogout: async function(){
			let result = await this.logout();
			if(result === true){
				this.$router.push('/login');
			}
			else{
				this.error = true;
				this.errorMessage = result.errorMessage || ''
			}
		},
		userUpdatePassword: async function(){
			if(this.newPassword1 !== this.newPassword2){
				this.errorNewPassword = true;
				this.errorNewPasswordMessage = "le nouveau mot de passe n est pas le meme dans les deux champs"; 
				return;
			}

			let result = await this.updatePassword(this.newPassword1);
			
			if(result === true){
				this.newPasswordOk = true;
				this.logout();
			}
			else{
				this.error = true;
				this.errorMessage = result.error || ''
			}
		}
	},
	data: function () {
		return {
			error: '',
			errorMessage: '',
			newPassword1: '',
			newPassword2: '',
			errorNewPassword: false,
			errorNewPasswordMessage: '',
			newPasswordOk: false,
			user: {}
		}
	}
}

</script>