// Initialize Firebase
var config = {
  apiKey: "AIzaSyBSl2knTxuNpTobPX3-PYFKltRBJex40Wc",
  authDomain: "medfinder-537df.firebaseapp.com",
  databaseURL: "https://medfinder-537df.firebaseio.com",
  projectId: "medfinder-537df",
  storageBucket: "medfinder-537df.appspot.com",
  messagingSenderId: "647838828818"
};
firebase.initializeApp(config);

function signIn() {
    // FirebaseUI config.
    var uiConfig = {
        signInSuccessUrl: 'medfinder.html',
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
            window.location.assign('<your-privacy-policy-url>');
        }
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
}

function signOut() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        let signOutBtn = document.getElementById('sign-out-button');
        signOutBtn.parentNode.removeChild(signOutBtn);
    }).catch(function(error) {
        // An error happened.
    });
}

function writeUserData(user, userName) {
    firebase.database().ref('users/' + user.uid).set({
        username: userName,
        email: user.email
    });
}

function signInExistingUser() {
    let email = document.getElementById('email').value;
    console.log(email);
    let password = document.getElementById('password').value;
    console.log(password);

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        return;
    });
    console.log('success');
}

function init(){
    document.getElementById('sign-in-form').onsubmit = signInExistingUser;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var uid = user.uid;
            document.getElementById('test').innerHTML=displayName + " " + email + " " + uid;
            let signOutBtn = document.createElement("BUTTON");
            let signOutMessage = document.createTextNode("Sign Out");
            signOutBtn.appendChild(signOutMessage);
            signOutBtn.onclick = signOut;
            signOutBtn.id = 'sign-out-button';
            document.getElementById('bink').appendChild(signOutBtn);
        } else {
            // User is signed out.
            // ...
        }
    });
}
window.onload = init;



firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var uid = user.uid;
        document.getElementById('test').innerHTML=displayName + " " + email + " " + uid;
        let signOutBtn = document.createElement("BUTTON");
        let signOutMessage = document.createTextNode("Sign Out");
        signOutBtn.appendChild(signOutMessage);
        signOutBtn.onclick = signOut;
        signOutBtn.id = 'sign-out-button';
        document.getElementById('bink').appendChild(signOutBtn);
    } else {
        // User is signed out.
        // ...
    }
});
initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            let signOutBtn = document.createElement("BUTTON");
            let signOutMessage = document.createTextNode("Sign Out");
            signOutBtn.appendChild(signOutMessage);
            signOutBtn.onclick = signOut;
            signOutBtn.id = 'sign-out-button';
            document.getElementById('firebaseui-auth-container').appendChild(signOutBtn);
        } else {
            // User is not signed in.
            signIn();
        }
    }, function(error) {
        console.log(error);
    });
};

window.addEventListener('load', function() {
    initApp()
});
