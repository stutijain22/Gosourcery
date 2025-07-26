import { Alert, PermissionsAndroid, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

const requestCameraPermission = async () => {
  let retrunType: boolean = false;
  if (Platform.OS === "android") {
    try {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      let deviceVersion = DeviceInfo.getSystemVersion();
      if (parseInt(deviceVersion) >= 13) {
        retrunType = true;
      } else {
        if (
          result["android.permission.CAMERA"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.READ_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.WRITE_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          retrunType = true;
        } else {
          retrunType = false;
        }
      }
    } catch (err) {
      console.log("err", err);
      retrunType = false;
    }
    return retrunType;
  } else {
    return true;
  }
};
  

export {
  requestCameraPermission,
};
