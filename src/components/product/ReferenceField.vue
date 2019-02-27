<template>
	<div>
		Reference 
		<input 
			type="text" placeholder="reference"
			:value="value"  
			@change='validate()' 
			@input="$emit('input', $event.target.value)"
		/> 
		<span v-if='errorMessage'>{{errorMessage}}</span>
	</div>
</template>

<script>

export default {
	props: ['value'],
	methods: {
		validate: function(){
			this.errorMessage = '';
			if(this.value.length < 4){
				this.errorMessage = 'too short'
			}
			if(this.value.length > 100){
				this.errorMessage = 'too long'
			}
			if(this.$root.store.products[this.value] != undefined){
				this.errorMessage = 'this ref already exists'
			}
		}
	},
	data: function () {
		return {
			errorMessage: '',
		}
	}
}

</script>