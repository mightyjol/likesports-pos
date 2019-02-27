<template>
	<div id="main" class='full-width'>
		<el-header>		
			<el-menu class="menu" :default-active="activeIndex" mode="horizontal" @select="handleSelect">
		    	<el-menu-item index="1">
		    		Home
		    	</el-menu-item>
			    <el-menu-item index="2">
		    		Products management
			    </el-menu-item>
		    	<el-menu-item index="3" v-if="this.$root.isAdmin">
	    		 	Inventory
		    	</el-menu-item>
			    <el-menu-item index="4" v-if="this.$root.isAdmin">
			    	Settings
			    </el-menu-item>
			</el-menu>
		</el-header>
		<el-main>
			<keep-alive>
		    	<router-view v-if="$route.meta.keepAlive" />
		    </keep-alive>
		    <router-view v-if="!$route.meta.keepAlive" /> 
		</el-main>
	</div>	
</template>

<script>
	
export default {
	 
	methods: {
		handleSelect(key, keyPath) {
        	this.$router.push(this.navigation[key])
     	}
	},
	data: function() {
		return {
			activeIndex: '1',
			navigation: {
				1:{ name:'home' },
				2:{ name:'products' },
				3:{ name:'inventory' },
				4:{ name:'settings' }
			}
		}
	}
}

</script>