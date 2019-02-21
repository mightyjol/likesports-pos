<template>
    <h1>
    	{{initText}}
    </h1>
</template>

<script>
	
export default {
	mounted: function () {
 		self = this;
		ipc.on('updateStatusText', function(event, data){
			self.updateText(data)
		})

		ipc.on('updateStatus', function(event, data){
			if(data == true){
				self.updateText('Programme à jour');
				setTimeout(() => {
					self.$router.replace('/');
				}, 500)
			}
		})
	},
	methods: {
		updateText: function (text) {
			this.initText = text
		}
	},
	data: function () {
		return {
			initText: "Initialisation"
		}
	}
}

</script>