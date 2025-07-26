import {Dimensions, PixelRatio, Platform, StatusBar} from 'react-native';
import {isIphoneX} from "./iPhoneXHelper";

// Retrieve initial screen's width
let screenWidth = Dimensions.get('window').width;

// Retrieve initial screen's height
let screenHeight = Dimensions.get('window').height;

/**
 * Converts provided width percentage to independent pixel (dp).
 * @param  {string} widthPercent The percentage of screen's width that UI element should cover
 *                               along with the percentage symbol (%).
 * @return {number}              The calculated dp depending on current device's screen width.
 */
const widthPercentageToDP = (widthPercent: number) => {
    // Parse string percentage input and convert it to number.
    const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);

    // Use PixelRatio.roundToNearestPixel method in order to round the layout
    // size (dp) to the nearest one that correspons to an integer number of pixels.
    return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};

/**
 * Converts provided height percentage to independent pixel (dp).
 * @param  {string} heightPercent The percentage of screen's height that UI element should cover
 *                                along with the percentage symbol (%).
 * @return {number}               The calculated dp depending on current device's screen height.
 */
const heightPercentageToDP = (heightPercent: number) => {
    // Parse string percentage input and convert it to number.
    const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);

    // Use PixelRatio.roundToNearestPixel method in order to round the layout
    // size (dp) to the nearest one that correspons to an integer number of pixels.
    return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};


const RFPercentage = (percent: any) => {
    const { height, width } = Dimensions.get("window");
    const standardLength = width > height ? width : height;
    const offset = width > height ? 0 : Platform.OS === "ios" ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

    const deviceHeight = offset && (isIphoneX() || Platform.OS === "android" ? standardLength - offset : standardLength);

    const heightPercent = deviceHeight && ( (percent * deviceHeight) / 100 );
    return heightPercent && Math.round(heightPercent);
};

// guideline height for standard 5" device screen is 680
const RFValue = (fontSize: any, standardScreenHeight: number = 680) => {

    const { height, width } = Dimensions.get("window");
    const standardLength = width > height ? width : height;
    const offset =
        width > height ? 0 : Platform.OS === "ios" ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

    const deviceHeight = offset && (isIphoneX() || Platform.OS === "android" ? standardLength - offset : standardLength);

    const heightPercent = deviceHeight && ( (fontSize * deviceHeight) / standardScreenHeight );
    return heightPercent && Math.round(heightPercent);
};


export {
    widthPercentageToDP,
    heightPercentageToDP,
    RFPercentage,
    RFValue
};