import {Dimensions, Platform, StatusBar} from 'react-native';
import {isIphoneX} from '../utils/iPhoneXHelper';

const { width, height } = Dimensions.get('window');
export const deviceWidth = Platform.OS === 'ios' ? Dimensions.get('window').width : Dimensions.get('window').width;
export const deviceHeight = Platform.OS === 'ios' ? Dimensions.get('window').height : Dimensions.get('window').height;

export const screenWidth = Dimensions.get('screen').width;
export const screenHeight = Dimensions.get('screen').height;

const bWidth = width >= 390 ? 428 : 390;
const bHeight = height >= 844 ? 926 : 844;

const baseWidth = bWidth;
const baseHeight = bHeight;
const scaleWidth = width / deviceWidth;
const scaleHeight = height / deviceHeight;

export const scaleSize = (size: number) => {
    return scaleWidth * size;
};

export const scaleFont = (size: number) => ( scaleHeight * size ) / bHeight;
