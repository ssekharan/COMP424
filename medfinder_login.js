(function() {
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

    // Get DOM Elements
    const Email = document.getElementById('Email');
    const Password = document.getElementById('Password');
    const LogIn = document.getElementById('login');
    //const btnSignUp = document.getElementById('btnSignUp');
    //const btnLogOut = document.getElementById('btnLogOut');

    // Add login event
    btnLogIn.addEventListener('click', e => {
        // Get Email and Password
        const email = txtEmail.value;
        const password = txtPassword.value;
        const auth = firebase.auth();

        const promise = auth.signInWithEmailAndPassword(email, password);

        promise.catch(e => {
            if (e.message === "There is no user record corresponding to this identifier. The user may have been deleted.") {
                console.log('no existing account :(');
            }
            if (e.message === "The password is invalid or the user does not have a password.") {
                // Password is incorrect
                console.log('password incorrect :(');
            }
        });
    });

    // Add Sign Up Event
    btnSignUp.addEventListener('click', e => {
        window.location.href = 'create-new-account.html';
    });

    // Add logout event
    btnLogOut.addEventListener('click', e => {
       firebase.auth().signOut();
    });

    // Add a realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser);
            btnLogOut.classList.remove('hide');
        }
        else {
            console.log('not logged in');
            btnLogOut.classList.add('hide');
        }
    });

}());
