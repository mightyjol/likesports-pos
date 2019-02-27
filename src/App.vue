<template>
	<div>		
	    <h1>
	    	App
	    </h1>
	    <nav>
	    	<router-link :to="{ name: 'home' }">
	    		<button>Home</button>
	    	</router-link>
	    	<router-link :to="{ name: 'products' }">
	    		<button>Products management</button>
	    	</router-link>
	    	<router-link :to="{ name: 'inventory' }" v-if="this.$root.isAdmin">
	    		<button>Inventory</button>
	    	</router-link>
	    	<router-link :to="{ name: 'settings' }" v-if="this.$root.isAdmin">
	    		<button>Settings</button>
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
	computed: {
		 
	},
	data: function() {
		return {
			 
		}
	}
}

</script>