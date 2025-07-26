import {Dimensions, Platform, StatusBar} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export function isIphoneX() {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTV &&
        ((dimen.height >= 812) || (dimen.height >= 896))
    );
}

export function isIphoneWithDynamicIsland() {
    const dimen = Dimensions.get('window');
    return DeviceInfo.hasDynamicIsland()/* (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTV &&
        ((dimen.height >= 812) || (dimen.height >= 896))
    ); */
}

export function ifIphoneX(iphoneXStyle?: any, regularStyle?: any) {
    if (isIphoneX()) {
        return iphoneXStyle;
    }
    return regularStyle;
}

export function getStatusBarHeight(safe: any) {
    return Platform.select({
        ios: ifIphoneX(safe ? 44 : 30, 20),
        android: StatusBar.currentHeight,
        default: 0
    });
}

export function getBottomSpace() {
    return isIphoneX() ? 34 : 0;
}