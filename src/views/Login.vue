<template>
	<el-row id="login" type="flex" align="middle" justify="center">
		<el-col class="loginContainer">
			<el-card>
				<div slot="header">
					<span>Login</span>
				</div>
				<div>
					<el-form :model="loginForm" @submit.prevent.native="checkData">
						<el-form-item label="email" prop="email">
							<el-input v-model="loginForm.email" type="email"></el-input>
						</el-form-item>
						<el-form-item label="password">
				    		<el-input v-model="loginForm.password" type="password"></el-input>
				    	</el-form-item>
				    	<el-form-item>
					    	<el-button type="primary" :loading="loginProcess" native-type="submit" @click="checkData">
					    		Se connecter
					    	</el-button>
					    </el-form-item>
			    	</el-form>
				</div>	 
			</el-card>   
		</el-col>
	</el-row>
   
</template>

<script>
export default {
	data: () => {
		return {
			loginForm: {
				email: 'jerome.hanke@gmail.com',
				password: 'testing'
			},
			loginProcess: false
		}
	},
	methods: {
		checkData: async function(e) {	
			e.preventDefault();	

			this.loginProcess = true;
			this.$firebase.auth().signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password)
		 	.then(() => {
		 		this.loginProcess = false;
		 	})
		 	.catch(e => {
		 		this.$message({
		          showClose: true,
		          message: e,
		          type: 'error'
		        })
				this.loginProcess = false;
		 	})			 
		}
	}
}

</script>