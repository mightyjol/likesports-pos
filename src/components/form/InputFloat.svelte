<script>
	export let value
	export let placeholder = ""

	function check(){
		value = value.replace(',','.')

		if(value.indexOf('.') !== -1){
			if(value.toString().split('.')[1].length >= 2){
				value = parseFloat(value).toFixed(2)
			}
		}
	}

	function blur(){
		value = parseFloat(value)
	}
</script>

<input type="text" on:blur={blur} on:input={check} bind:value {placeholder}>
