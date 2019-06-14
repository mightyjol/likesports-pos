<script>
	export let segment;

	function openWindow(name){
		ipc.send('onpenWindow', {
			name: name
		})
	}
 
</script>

<style>
	li{
		display: inline-block;
	}
	a{
		display: block;
		padding: 10px 20px;
	}
	a:hover{
		background-color: #DDD;
	}
</style>

<nav>
	<ul>
		<li><a href='/shop/'>Home</a></li>
		<li><a href='/shop/orders/'>Orders</a></li>
		<li><a href='/shop/products/'>Products</a></li>
		<li><a href='/shop/inventories/'>Inventories</a></li>
		<li><a href='/shop/settings/'>Settings</a></li>
	</ul>
</nav>