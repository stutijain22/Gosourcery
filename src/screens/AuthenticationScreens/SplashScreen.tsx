import React, { useEffect, useState } from 'react';
import { Image, StatusBar, View } from 'react-native';
import { deviceHeight, deviceWidth } from '../../styling/mixin';
import { getEssentials, resetScreen } from '../../utils/utility';
import { SPLASH_IMAGE } from '../../utils/sharedImages';
import { splashScreenStyle } from '../../styling/shared';
import { S_BottomTabsDashboard, S_LoginScreen } from '../../constant/screenNameConstants';
import { getData } from '../../utils/AsyncStorage';
import { key_setLoginToken } from '../../constant/Constant';

const SplashScreen = () => {
    const { navigation, theme } = getEssentials();

    useEffect(() => {
        (async () => {
            setTimeout(async() => { 
                const loginToken = await getData(key_setLoginToken);
                console.log('loginToken', loginToken);
                
                if(loginToken){
                    resetScreen(navigation, S_BottomTabsDashboard);
                }else{
                    resetScreen(navigation, S_LoginScreen);
                }}, 3000)
        })();
        return () => {
            console.log('unmont')
        };
    }, []);

    return (
        <View style={{ height: deviceHeight, width: deviceWidth, justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar backgroundColor={"#020202"} barStyle="light-content" />
            <Image
                resizeMode='contain'
                style={splashScreenStyle}
                source={SPLASH_IMAGE}
            />
        </View>
    );
};

export default SplashScreen;