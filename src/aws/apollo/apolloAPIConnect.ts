// api/callGraphQL.ts

import awsconfig from "../../aws-exports";
import { key_setLoginToken, key_setUserId } from "../../constant/Constant";
import { S_LoginScreen } from "../../constant/screenNameConstants";
import { storeData } from "../../utils/AsyncStorage";
import { resetScreen } from "../../utils/utility";
import { signOut } from '@aws-amplify/auth';

export const callGraphQL = async (query: string, variables: any = {}, token: string, navigation: any) => {
    try {
      const response = await fetch(awsconfig.aws_appsync_graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Token from Cognito
          'region':awsconfig.aws_project_region,
          'defaultAuthMode': awsconfig.aws_defaultAuthMode,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });
  
      const json = await response.json();
      if (json.errors) {
        const message = json.errors[0]?.message?.toLowerCase();
        const errorCode = json.errors[0]?.errorType;
// console.log('message-- ==> ', message);
  
        if (errorCode === "UnauthorizedException" || message.includes('Token has expired')) {
          console.warn('🔐 Session expired, redirecting to login...');
          await storeData(key_setLoginToken, "");
          await storeData(key_setUserId, "");
          if (navigation) {
            await signOut();
            await resetScreen(navigation, S_LoginScreen);
          }
          throw new Error('Session expired. Redirecting to login...');
        }
  
        console.error('❌ GraphQL Error:', json.errors);
        throw new Error(json.errors[0].message);
      }
      return json.data;
    } catch (error:any) {
      console.error('❌ API Error:', error?.message);
      throw error;
    }
  };
  