<template>
	<div>
		<h4>Settings</h4><br>
		<nav>
			<router-link to="user">
				<button>Profil</button>
			</router-link>	
			<router-link to="prestashop">
				<button>Prestashop</button>
			</router-link>	
		</nav>
		<keep-alive>
	    	<router-view v-if="$route.meta.keepAlive" />
	    </keep-alive>
	    <router-view v-if="!$route.meta.keepAlive" /> 
	</div>
</template>

<script>
	
export default {
	created: function () {
	 
	},
	methods: {
		 
	},
	data: function () {
		return {
			
		}
	}
}

</script>