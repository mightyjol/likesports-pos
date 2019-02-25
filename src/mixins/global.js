const initialStore = require('./../../config/initialStore.js')
const config = require ('./../../config/default.js')
const apiRoutes = config.apiRoutes

const security = require('./security.js');
const prestashop = require('./prestashop.js');

setBearerToken = function(token){
  return {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }
}

//todo refactor more -> create the prestashop wrapper
let mixins = {
  methods: {
    closeListener: function(){
      //console.error(this)
      let self = this;
      window.onbeforeunload = async(e) => {
        console.log('I do not want to be closed')

        await self.logout();

        ipc.send('canQuit', true);
      }
    },
    prestashopBuildBaseUrl: prestashop.buildBaseUrl,
    prestashopPing: prestashop.ping,
    authListener: security.authListener,
    updatePassword: security.updatePassword,
    login: security.login,
    logout: security.logout,
    call911: function(error){
      console.error(error);
    	return alert('Une erreur s\'est produite, veuillez contacter le support à ' + config.support.email);
    }
  }
}

module.exports = mixins