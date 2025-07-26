// import {
//   CognitoUser,
//   AuthenticationDetails
// } from 'amazon-cognito-identity-js';
import { signIn,fetchAuthSession } from '@aws-amplify/auth';
// import { userPool } from './cognito'; // your Cognito config

export const loginUser = async (username, password,setIsLoading) => {
  try {
    await signIn({ username:username, password:password });
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    return idToken;
  } catch (err) {
    console.error('Sign-in error:', err);
    throw err;
  }

  // return new Promise((resolve, reject) => {
    // const authDetails = new signUp({
    //   Username: username,
    //   Password: password,
    // });
    // console.log('username:', username);

    // console.log('authDetails:', authDetails);

    // const cognitoUser = new CognitoUser({
    //   Username: username,
    //   Pool: userPool,
    // });
    // console.log('cognitoUser:', cognitoUser);

    // cognitoUser.authenticateUser(authDetails, {
    //   onSuccess: (result) => {
    //     const idToken = result.getIdToken().getJwtToken();
    //     console.log('idToken:', idToken);
    //     // setIsLoading(false);
    //     resolve(idToken); // ✅ return token
    //   },
    //   onFailure: (err) => {
    //     setIsLoading(false);
    //     console.error('❌ Login failed:', err.message);
    //     reject(err);
    //   },
    // });
  // });
};