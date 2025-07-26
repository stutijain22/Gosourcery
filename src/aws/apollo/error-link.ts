import { onError } from '@apollo/client/link/error';
import { storeData } from '../../utils/AsyncStorage';
import { key_setLoginToken } from '../../constant/Constant';
import { resetScreen } from '../../utils/utility';
import { S_LoginScreen } from '../../constant/screenNameConstants';

// export const errorLink = onError(({ graphQLErrors, networkError, response, operation }) => {
//     if (graphQLErrors) {
//         for (const error of graphQLErrors) {
//             console.error(
//                 `[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`,
//                 operation,
//                 response
//             );
//         }
//     }
//     if (networkError) {
//         console.error(`[Network error]: ${networkError}`, operation, response);
//     }
// });

export const errorLink = onError(({ graphQLErrors, networkError, navigation,response, operation }: any) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(async ({ message, extensions }:any) => {
        const errorCode = extensions?.code;
        // logCrash(`[GraphQL error]: Code: ${errorCode}, Message: ${message}, Location: ${locations}, Path: ${path}`)
        // recordCrashError(`[GraphQL error]: Code: ${errorCode}, Message: ${message}, Location: ${locations}, Path: ${path}`)
        // console.error(`[GraphQL error]: Code: ${errorCode}, Message: ${message}, Location: ${locations}, Path: ${path}, API: ${APINAME}`);
        if(errorCode === "SESSION_EXPIRED" || message.toLowerCase().includes("session expired! please login again")) {
            // await logout();
            await storeData(key_setLoginToken, "");
            await resetScreen(navigation, S_LoginScreen);
        }
      });
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`, operation, response);
        
    }
});