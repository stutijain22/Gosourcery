import {Platform} from "react-native";
import { CommonActions, StackActions, useNavigation } from '@react-navigation/native';
import { setThemeJSON } from "./context";
import NetInfo from "@react-native-community/netinfo";
import { storeData, storeJSONData } from "./AsyncStorage";
import { key_selectCollection, key_selectWorkSpace, key_setCollectionList, key_setHistoryList, key_setLoginToken, key_setUserData, key_setUserScanData, key_setUserId, key_setWorkspaceList, key_setHistoryPendingList, key_setProfileData } from "../constant/Constant";

export const getKeyboardHeight = (btnLocation: number) => {
    if (Platform.OS === 'ios') {
        return btnLocation;
    } else {
        return 0;
    }
};


export const getEssentials = () => {
    const navigation = useNavigation();
    const theme = setThemeJSON();

  return {navigation, theme}
};

export const parseData = (rawData: string) => {
    const parts = rawData.split("^");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = parts.find(part => emailRegex.test(part));
    return email;
}

export const isNetAvailable = () => new Promise((resolve, reject) => {
    NetInfo.addEventListener(state => {
        const netInfo = state.isConnected;
        resolve(netInfo);
    });
});

  
export const formatPhoneNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Apply formatting
    let formatted = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 6) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length > 6) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  
    return formatted;
  };

export const emailValidation = (email: string) => {
    if (email !== null) {
      const emailTrimmed = email.trim();
      const reg =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return reg.test(emailTrimmed.toLocaleLowerCase());
    } else {
      return false;
    }
  };
  
// export const getDeviceDetails = async () => {

//     let deviceDetails: any = {
//         deviceType: "app",
//         deviceAppVersion: "1.0.0",
//         deviceCountry: "In",
//         deviceOs: Platform.OS,
//         deviceToken:"",
//         deviceUniqueId:""
//         // deviceFcmToken: await getData(key_setFcmToken)
//     };

//     await DeviceInfo.getUniqueId().then((uniqueId) => {
//         console.log(uniqueId);
//         deviceDetails.deviceUniqueId = uniqueId;
//     });
//     await DeviceInfo.getDeviceToken().then((deviceToken) => {
//         // iOS: "a2Jqsd0kanz..."
//         deviceDetails.deviceToken = deviceToken;
//       });
//     return deviceDetails;
// };

export const navigateScreen = (navigation: any, screenName: string, params?: object) => {
    if (params) {
        return navigation.navigate(screenName, params);
    } else {
        return navigation.navigate(screenName);
    }

};

export const resetScreen = ( navigation: any, screenName: string, params?: object ) => {
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [
                { name: screenName, params },
            ],
        })
    );
};

export const popScreen = ( navigation: any, count: number ) => {
    navigation.dispatch(
        StackActions.pop(count)
    );
};

export const logout = async () => {
  await storeData(key_setLoginToken, "");
  await storeData(key_setUserId, "");
  await storeData(key_setUserScanData, '');
  await storeJSONData(key_setUserData, []);
  await storeJSONData(key_selectWorkSpace, {});
  await storeJSONData(key_selectCollection, {});
  await storeJSONData(key_setCollectionList, []);
  await storeJSONData(key_setWorkspaceList, []);
  await storeJSONData(key_setHistoryList, []);
  await storeJSONData(key_setHistoryPendingList, []);
  await storeJSONData(key_setProfileData, []);
};


export const goBack = (navigation: any) => {
    return navigation.goBack();
};

