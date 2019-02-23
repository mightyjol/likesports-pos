const initialStore = require('./../../config/initialStore.js')
const config = require ('./../../config/default.js')
const apiRoutes = config.apiRoutes

const security = require('./securityMixins.js');

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
    getCurrentUserInfo: function(){
      return this.$firebase.auth().currentUser;   
    },
    getAllData: function(){
      this.$store.user = this.$firebase.auth().currentUser
      // get settings
      // get inventory
      // get orders
    },
    closeListener: function(){
      let self = this;
      window.onbeforeunload = async(e) => {
        console.log('I do not want to be closed')

        await self.logout();

        ipc.send('canQuit', true);
      }
    },
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