module.exports.buildBaseUrl = function(domain = this.$store.prestashop.domain){
	return 'https://' + domain + '/api';
}

module.exports.ping = async function(domain = this.$store.prestashop.domain, key = this.$store.prestashop.key){
	let pingUrl = 
		this.prestashopBuildBaseUrl(domain) + 
		this.$store.prestashop.routes.ping +
		'&ws_key=' + key;

	let result = false;
	await this.$http.head(pingUrl)
	.then(data => {
		result = data.ok
	})
	.catch(e => {
		//this.call911(e);
		console.error(e)
	});

	return result;
}