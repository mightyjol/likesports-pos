<template>
	<div>		
	    <h1>
	    	App
	    </h1>
	    <nav>
	    	<router-link to="home">
	    		<button>Home</button>
	    	</router-link>
	    	<router-link to="inventory">
	    		<button>Inventory</button>
	    	</router-link>
	    	<router-link to="settings">
	    		<button>Settings</button>
	    	</router-link>
	    </nav>
	    <ul>
	    	<li  >
	    		{{userInfo.name}}

	    	</li>
	    	<li  >
	    		{{userInfo.email}}

	    	</li>
	    	<li  >
	    		{{userInfo.client_name}}

	    	</li>
	    </ul>
	    <keep-alive>
	    	<router-view v-if="$route.meta.keepAlive" />
	    </keep-alive>
	    <router-view v-if="!$route.meta.keepAlive" /> 
	</div>
</template>

<script>
	
export default {
	computed: {
		userInfo : function(){
			return this.$root.store.user
		}
	},
	data: function() {
		return {
			 
		}
	}
}

</script>