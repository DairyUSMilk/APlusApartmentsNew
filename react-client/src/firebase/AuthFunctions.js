import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    signInWithEmailAndPassword,
    updatePassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    EmailAuthProvider,
    reauthenticateWithCredential
  } from 'firebase/auth';
  
  async function createUser(email, password) {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password);
  }
  
  async function addUserDisplayName(displayName) {
    const auth = getAuth();
    await updateProfile(auth.currentUser, {displayName: displayName});
  }

  async function changePassword(email, oldPassword, newPassword) {
    let auth = getAuth();
    let credential = EmailAuthProvider.credential(email, oldPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
  
    await updatePassword(auth.currentUser, newPassword);
    await logOut();
  }
  
  async function logIn(email, password) {
    let auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
  }
  
  async function googleLogIn() {
    const auth = getAuth();
    const socialProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, socialProvider);
  }
  
  async function resetPassword(email) {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  }
  
  async function logOut() {
    const auth = getAuth();
    await signOut(auth);
  }
  
  export {
    createUser,
    addUserDisplayName,
    logIn,
    googleLogIn,
    resetPassword,
    logOut,
    changePassword
  };