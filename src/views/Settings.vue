<template>
	<div>
		<h4>Settings</h4><br>
		<nav>
			<router-link :to="{ name: 'user' }">
				<button>Profil</button>
			</router-link>	
			<router-link :to="{ name: 'prestashop' }">
				<button>Prestashop</button>
			</router-link>	
			<router-link :to="{ name: 'printer' }">
				<button>Printers</button>
			</router-link>
			<router-link :to="{ name: 'terminal' }">
				<button>Payment terminal</button>
			</router-link>
			<router-link :to="{ name: 'tags' }">
				<button>Brands and tags</button>
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