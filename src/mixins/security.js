const initialStore = require('./../../config/initialStore.js');

module.exports.login = async function(email, password){
  //send to login
  let result = false;
  await this.$firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(user){
    console.log('logged in successfully');
    result = true;
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    result = {
      error: errorMessage,
      errorCode: errorCode
    };
  });

  return result
};

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
      // User is signed in.
      self.$store.user.uid = user.uid;
      self.$store.user.email = user.email;
      //loading shit 
      self.$router.replace('/load');
    } else {
      // No user is signed in => reset
      self.$store = initialStore;
      self.$router.replace('/login');
    }
  });
};