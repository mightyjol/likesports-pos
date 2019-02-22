<template>
	<div>
		<h4>Settings</h4>
 
		<p>{{test}}</p>

	</div>
</template>

<script>
	
export default {
	mounted: function () {
		let self = this
 		setInterval(function(){
 		 	self.test++;
 		}, 50)
	},
	methods: {
		 
	},
	data: function () {
		return {
			test: 0
		}
	}
}

</script>