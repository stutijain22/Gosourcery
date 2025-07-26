import React, { FC } from "react";
import {
    View,
    TouchableOpacity,
    ViewStyle,
    StyleSheet,
} from "react-native";
import { widthPercentageToDP } from "../utils/responsiveUI";
import { theme1 } from "../styling/themes";
import { DMSansBold, DMSansMedium } from "../constant/Constant";
import { getEssentials } from "../utils/utility";
import TextComponent from "./TextComponent";
import { isTablet } from "react-native-device-info";

interface CustomTabViewProps {
    containerStyle?: ViewStyle;
    selectedStyle?: ViewStyle;
    setSelectedOption?: any;
    selectedOption?: any;
    tabFirstValue?: string;
    tabSecondValue?: string;
    optionArray?: any;
    onPress?: any;
}

const CustomTabView: FC<CustomTabViewProps> = (props) => {
    const { theme } = getEssentials();

    return (
        <View style={props.containerStyle}>
            {
                props.optionArray && props.optionArray.map((item: any) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{ flex: 1 }}
                            key={item.id}
                            onPress={async () => {
                                props.setSelectedOption(item.title)
                                props?.onPress(item.title)
                            }}
                        >
                            {props.selectedOption == item.title ? (
                                <View style={styles.selectedStyle}>
  <TextComponent
                                        fontFamily={DMSansBold}
                                        fontSize={14}
                                        color={theme?.theme.WHITE_COLOR}
                                        value={item.title}
                                    />
                                </View>
                                  
                            ) : (
                                <View style={styles.unSelectedStyle}>
                                    <TextComponent
                                        fontFamily={DMSansMedium}
                                        fontSize={14}
                                        color={theme?.theme?.BLACK_COLOR}
                                        value={item.title}
                                    />
                                </View>
                            )}
                        </TouchableOpacity>
                    )
                })

            }

        </View>
    );
};

const styles = StyleSheet.create({
    unSelectedStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        alignSelf: 'center',
    },
    selectedStyle: {
        backgroundColor:theme1?.BLUE_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        width:isTablet()?widthPercentageToDP(46) :widthPercentageToDP(43),
        height: 40,
        borderRadius: 10,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginHorizontal: 5
    },
    unSelectedStylePatientTab: {
        backgroundColor: theme1?.LIGHT_GREY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        width:isTablet()?widthPercentageToDP(46) :widthPercentageToDP(43),
        height: 40, borderRadius: 10,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
        marginHorizontal: 5
    }
});

export default CustomTabView;
