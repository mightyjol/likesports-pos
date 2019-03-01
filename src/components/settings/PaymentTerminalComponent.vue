<template>
	<div>
		<h6>Payment terminal</h6><br>

		//test bancontact
		<input type="number" v-model="amount" />
		<button @click="sendSignal">
			send signal
		</button>
	</div>
</template>

<script>
	
export default {
	created: async function () {
		 
	},
	methods: {
		sendSignal: function(){
			console.error(amount)
		} 
	},
	data: function () {
		return {
			amount: 0.01
		}
	}
}

</script>