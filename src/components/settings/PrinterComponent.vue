<template>
	<div>
		<h6>Printers Settings</h6><br>
		<div>
			<div v-for="printer in printers">
				test
			</div>
		</div>
		//full-page printer
		//ticket printer
	</div>
</template>

<script>
	
export default {
	created: async function () {
		ipc.send('getPrinters');
		ipc.on('printers', function(event, data){
			this.printers = data;
		});
	},
	methods: {
		 
	},
	data: function () {
		return {
			printers: {}
		}
	}
}

</script>