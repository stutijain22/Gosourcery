/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-reanimated';
// import './src/aws/amplifyConfig'; 
import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StackRouters } from './src/routers/StackRouters';
import { ThemeContext } from './src/utils/context';
import { getTheme } from './src/styling/themes';
import {Amplify} from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { requestCameraPermission } from './src/utils/PermissionApp';

Amplify.configure(awsconfig);

function App(): React.JSX.Element {
  // const navigation = useNavigation();
  const theme = getTheme(1) || getTheme();

  useEffect(() => {
    (async () => {
    await requestCameraPermission();
  })();
  }, []);

  return (
    <SafeAreaProvider /*  style={backgroundStyle} */>
      {/* <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      /> */}
      
       <ThemeContext.Provider value={{ theme }}>
       {/* <ApolloProvider client={client}> */}
      <NavigationContainer >
        <StackRouters />
      </NavigationContainer>
      {/* </ApolloProvider> */}
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}

export default App;

