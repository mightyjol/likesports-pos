module.exports.buildBaseUrl = function(domain = this.$root.store.settings.prestashop.domain){
	return 'https://' + domain + '/api';
}

module.exports.ping = async function(domain = this.$root.store.settings.prestashop.domain, key = this.$root.store.settings.prestashop.key){
	let pingUrl = 
		this.prestashopBuildBaseUrl(domain) + 
		this.$root.store.settings.prestashop.routes.ping +
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