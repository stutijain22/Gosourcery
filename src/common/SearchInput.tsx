import { deviceWidth } from "../styling/mixin";
import { Image, Platform, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import { imageTypes, resizeMode } from "../utils/enums";
import React, { FC } from "react";
import ImageComponent from "./ImageComponent";
import { getEssentials } from "../utils/utility";
import Spacer from "../styling/Spacer";
import { DMSansMedium } from "../constant/Constant";
import { KT_DEFAULT, KT_DONE } from "../constant/keyboardReturnType";
import { CROSS_ICON } from "../utils/sharedImages";

interface TextInputComponentProps {
    search: string | '';
    searchPlaceholder?: string;
    handleSearch?: any;
    refInner?: any;
    clearSearch?: () => void;
    conatinerStyle?: ViewStyle;
    textStyle?:any;
    filterIcon?: boolean;
    filterIcons?: string;
    placeholderTextColor?:string;
    tintColor?:any;
    displayImg?: any;
    mrRight?: any;
    SearchHeight?: any;
    widthImg?: any;
    keyPress?:any
    width?:any;
    bgColor?: any;
    isNew?:any;
    editable?: boolean;
}

const SearchInput: FC<TextInputComponentProps> = (props) => {

    const { theme } = getEssentials();

    const {
        search = '',
        searchPlaceholder = '',
        SearchHeight = 39,
        mrRight = 15,
        bgColor = theme?.theme?.SEARCH_BOX_COL,
        placeholderTextColor = 'grey'
    } = props;

    return <View style={[props.conatinerStyle? props.conatinerStyle:{
         flexDirection: 'row', 
        //  flex:1,
         justifyContent: 'center', 
        //  alignItems: 'center',
         alignSelf:'center',
         height: SearchHeight,
        // marginRight:mrRight, 
        borderBottomWidth:1,
        borderBottomColor: theme?.theme?.BLACK_COLOR,
        padding:0,
         width: props.width? props.width:deviceWidth - 44,
        //  borderRadius: 39, 
         backgroundColor: bgColor
         }]}>
            <TextInput
                onChangeText={props.handleSearch}
                placeholder={'Search' + " " + searchPlaceholder}
                placeholderTextColor={placeholderTextColor}
                value={search}
                style={[props.textStyle? props.textStyle:{
                    textAlign: 'left', 
                    fontFamily: DMSansMedium,
                    flex: 1, 
                    fontSize: 14,
                    paddingHorizontal: 12, 
                    letterSpacing: 1,
                     paddingVertical: 10,
                }]}
                onFocus={(e) => {
                }}
                onBlur={(e) => {
                }}
                returnKeyType={KT_DONE}
                keyboardType={KT_DEFAULT}
                autoCapitalize={"none"}
                autoCorrect={false}
                editable={props?.editable}
                onKeyPress={props.keyPress}
            />

            {/* <ImageComponent tintColor={props.tintColor?props.tintColor: theme?.theme?.GREY} source={SEARCH_ICON} resizeMode={resizeMode.cover} height={13} width={13}
                            imageType={imageTypes.local} styles={{ position: 'absolute', left: 15, alignSelf: 'center' }} /> */}



            {search?.length > 0 &&
            <TouchableOpacity onPress={props.clearSearch} style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 15, borderWidth: 1, borderColor: theme?.theme?.HEADER_TEXT_COLOR, borderRadius: 50, height: 20, width: 20, alignSelf: 'center' }}>
                <ImageComponent tintColor={theme?.theme?.HEADER_TEXT_COLOR} source={CROSS_ICON}
                                resizeMode={resizeMode.contain} height={10} width={10}
                                imageType={imageTypes.local}
                                styles={{ alignSelf: 'center' }} />
            </TouchableOpacity>
            }
    </View>
};

export default SearchInput;