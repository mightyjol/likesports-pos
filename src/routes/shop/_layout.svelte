<script context="module">
	export function preload(page, session) {
		if (!session.user) {
			console.log('redirecting')
			return this.redirect(302, '/');
		}
	}
</script>

<script>
	import Nav from '../../components/Nav.svelte'

	export let segment;
</script>

<Nav {segment} /> 
<slot></slot>	