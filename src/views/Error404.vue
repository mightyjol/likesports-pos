<template>
	<el-main>
		<el-row type="flex" align="middle" justify="center" style="height: 100%;">
			<el-col style="max-width: 500px">
				<el-card class="box-card">
					<div slot="header" class="clearfix" style="text-align: center">
						<span>Une erreur s'est produite</span>
					</div>
					<router-link :to="{ name: 'home' }">	
						<el-button style="width: 100%" type="danger">
							Retour à l'accueil
						</el-button>
					</router-link>
				  </div>
				</el-card>
			</el-col>
		</el-row>
	</el-main>
</template>

<script>
	
export default {
	data: function () {
		return {
		}
	}
}

</script>