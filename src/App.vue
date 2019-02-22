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
	    <keep-alive>
	    	<router-view />
	    </keep-alive>
	</div>
</template>

<script>
	
export default {
	data: () => {
		return {
			
		}
	}
}

</script>