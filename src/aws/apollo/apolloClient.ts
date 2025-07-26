// import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
// import { Auth } from 'aws-amplify';
// import awsconfig from '../../aws-exports';
// import { errorLink } from './error-link';


// const httpLink = createHttpLink({
//   uri: awsconfig.aws_appsync_graphqlEndpoint,
// });
// const authLink = setContext(async (_, { headers }) => {
//   try {
//     // Get the current Cognito ID token
//     const session = await Auth.currentSession();
//     const token = session.getIdToken().getJwtToken();
// console.log('token-- ==> ', token);
// console.log('headers-- ==> ', headers);

//     return {
//       headers: {
//         ...headers,
//         Authorization: token,
//       },
//     };
//   } catch (err) {
//     console.error('Unable to get auth token:', err);
//     return { headers };
//   }
// });

// export const client = new ApolloClient({
//   link:from([errorLink, authLink.concat(httpLink)]),
//   cache: new InMemoryCache(),
// });




// // import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// // import { setContext } from '@apollo/client/link/context';
// // import { Auth } from 'aws-amplify';
// // import awsconfig from '../../aws-exports';

// // const httpLink = createHttpLink({
// //   uri: awsconfig.aws_appsync_graphqlEndpoint,
// // });

// // const authLink = setContext(async (_, { headers }) => {
// //   const session = await Auth.currentSession();
// //   const token = session.getIdToken().getJwtToken();

// //   return {
// //     headers: {
// //       ...headers,
// //       Authorization: token,
// //     },
// //   };
// // });

// // export const client = new ApolloClient({
// //   link: authLink.concat(httpLink),
// //   cache: new InMemoryCache(),
// // });
