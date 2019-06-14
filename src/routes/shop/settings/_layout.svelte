<script>
	import NavSettings from '../../../components/layouts/NavSettings.svelte'

	export let segment;
</script>

<NavSettings {segment} /> 
<slot></slot>	