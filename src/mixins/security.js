const initialStore = require('./../../config/initialStore.js');

module.exports.logout = async function(){
  let self = this;
  let result = false;

  await this.$firebase.auth().signOut().then(function() {
    result = true;
  }, function(error) {
    console.error('Sign Out Error', error);
    result = {
      errorMessage: error
    };
  });

  return result
};

module.exports.updatePassword = async function(newPassword){
  console.error(newPassword)
  let result = false

  await this.$firebase.auth().currentUser.updatePassword(newPassword)
  .then(data => {
    result = true;
  })
  .catch(e => {
    this.call911(e);
  });

  return result
};

module.exports.authListener = function(){
  let self = this
  this.logout();
  this.$firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

      //loading shit 
      self.$router.replace('/load');
    } else {
      // No user is signed in => reset
      self.$root.store = initialStore;
      self.$router.replace('/login');
    }
  });
};