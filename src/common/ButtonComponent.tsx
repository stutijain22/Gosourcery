import React, { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Spacer from "../styling/Spacer";
import { imageTypes, resizeMode } from "../utils/enums";
import { getEssentials } from "../utils/utility";
import ImageComponent from "./ImageComponent";
import { DMSansBold } from "../constant/Constant";

interface ButtonProps {
    onHandleClick: () => void;
    title: string;
    styles?: {},
    height: number | string,
    width: number | string,
    fontColor?: string | '#ffffff',
    textStyle?: {},
    iconStyle?: {},
    isIconAvailable?: boolean;
    isRigthIconAvailable?:boolean;
    btnBackgroundColor?: any;
    borderBackgroundColor?:any;
    leftIcon?: string;
    rightIcon?: string;
    borderRadius?: number;
    iconHeight?: number;
    iconWidth?: number;
    customColor?: any;
    x_start?: any;
    y_start?: any;
    x_end?: any;
    y_end?: any;
    isDisabled?: boolean;
    tintColor?: any;
}

const ButtonComponent: FC<ButtonProps> = (props) => {

    const { theme } = getEssentials();

    const {isDisabled = false,borderBackgroundColor, isIconAvailable = false, 
        iconHeight = 15, iconWidth = 15, isRigthIconAvailable= false} = props;

    return (
         <TouchableOpacity disabled={isDisabled} 
         style={{ flexDirection: 'row', 
            justifyContent: 'center', alignItems: 'center',
            backgroundColor:isDisabled && !isRigthIconAvailable?
            theme?.theme.DARK_GREY_COLOR : props.btnBackgroundColor,
            alignSelf:'center',
            height: props.height,
            width: props.width,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 40,
            borderWidth:  props.borderBackgroundColor ? 2 : 0,
            borderColor:isDisabled ?theme?.theme.DARK_GREY_COLOR:
             props.borderBackgroundColor,
             
          }} 
         onPress={props.onHandleClick}>

            {isIconAvailable && !isRigthIconAvailable &&
            <ImageComponent tintColor={props?.tintColor} styles={props.iconStyle} 
            width={iconWidth} height={iconHeight} resizeMode={resizeMode.contain}
             imageType={imageTypes.local} source={props.leftIcon} />}
            {isIconAvailable && <Spacer width={15}/> }
            <View style={{flexDirection:'row'}}>

            {isRigthIconAvailable ? 
            <View style={{flexDirection:"row",justifyContent:"space-between",
            flex:1, alignItems:'center',flexShrink: 1,flexWrap: 'wrap',}}>
            <Text style={[{ fontFamily: DMSansBold, 
            fontSize: 14, flex:1,letterSpacing: 1.1,
            color: props.fontColor ?isDisabled ? theme?.theme.DARK_GREY_COLOR
            :props.fontColor : theme?.theme.WHITE_COLOR }, 
            props.textStyle ]}
            numberOfLines={1} // truncate with ellipsis
            // ellipsizeMode='clip'
            >
            {props.title}
                </Text>

            <ImageComponent tintColor={isDisabled ?
            theme?.theme.DARK_GREY_COLOR:props?.tintColor} 
            styles={props.iconStyle} 
            width={iconWidth} height={iconHeight} resizeMode={resizeMode.contain}
             imageType={imageTypes.local} source={props.rightIcon} />
            {isIconAvailable && <Spacer width={10}/> }
            </View>
            :
            <Text style={[{ fontFamily: DMSansBold, fontSize: 16,
                color: props.fontColor ? props.fontColor : theme?.theme.WHITE_COLOR }, 
                    props.textStyle ]}>{props.title}</Text>
            }
            </View>
           
        </TouchableOpacity>)
};

export default ButtonComponent;