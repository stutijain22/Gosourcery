import React, { FC, ReactNode, useEffect, useState } from "react";
import { Keyboard, TextInput, TextInputProps, View, Text, TouchableOpacity } from "react-native";
import TextComponent from "./TextComponent";
import Spacer from "../styling/Spacer";
import { getEssentials } from "../utils/utility";
import { imageTypes, resizeMode } from "../utils/enums";
import ImageComponent from "./ImageComponent";
import { DMSansBold, DMSansMedium } from "../constant/Constant";

interface TextInputComponentProps {
    value: string | any;
    placeholder: string;
    placeholderTextColor?: string;
    styles?: object,
    color?: string,
    fontFamily?: string,
    fontSize?: number,
    props?: TextInputProps & TextInputProps,
    //onChangeText?: () => void;
    onChangeText?: any;
    onChange?: any;

    wrapperTitleStyle?: any | object;
    wrapperTitleTextStyle?: any | object;

    // wrapper props
    isFocused?: boolean | false,
    hasWrapperTitle?: boolean | false,
    textWrapperStyle?: object,
    wrapperTextTitle?: string | '',
    wrapperWidth?: number | 0,
    wrapperHeight?: number | 0,

    // left right icons props
    showLeftIcon?: boolean | false,
    showRightIcon?: boolean | false
    rightIconVisible?: boolean | false
    leftIcon?: any | null,
    iconHeight?: any | null,
    iconWidth?: any | null,
    rightIcon?: any | null,
    closedRightIcon?: any | null,
    leftText?: string | undefined,
    rightText?: string | undefined,
    rightTextStyle?: {} | [],
    maxLength?: any,
    tintColor?: any;
    wrapperBackgroundColor?: any;
    // focus
    onFocusChanged: (isFocused: boolean) => void,
    getKeyboardHeight: (btnLocation: number) => void,
    onBlur?: any,
    refInner?: any;

    disabled?: boolean;

    showValidationError?: boolean;
    showValidationErrorStyle?: {} | [];
    showValidationErrorMessage?: string;
    secureTextEntry?: boolean;
    showPassword?: any;
    setShowPassword?: any;
    isGradient?: boolean;
    isPasswordSecure?: boolean;
    setIsPasswordSecure?: any;
    numberOfLines?: any;
    editable?: boolean;
    multiline?: boolean;
    withLinerGradient?: boolean;
}

const TextInputComponent: FC<TextInputComponentProps> = (props) => {

    const { theme } = getEssentials();

    const [focus, setFocus] = useState(false);

    const [btnLocation, setButtonLocation] = useState(0);
    const [showIcon, setShowIcon] = useState(false);

    const { iconHeight = 40, iconWidth = 40 } = props;

    const {
        disabled = false,
        showValidationError = false,
        showValidationErrorMessage = "* This Field Is Required",
        wrapperTitleStyle = {},
        rightTextStyle = {
            color: theme?.theme?.BLACK_COLOR,
            fontSize: 13,
            fontFamily: DMSansBold
        },
        wrapperTitleTextStyle = { letterSpacing: 0.6, color: '#121217' },

        placeholderTextColor = "transparent",
        showValidationErrorStyle,
        wrapperBackgroundColor
    } = props;

    useEffect(() => {

        function keyboardWillShow(e: any) {
            setButtonLocation(e.endCoordinates.height);
        }

        function keyboardWillHide(e: any) {
            setButtonLocation(0);
        }

        Keyboard.addListener('keyboardWillShow', keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', keyboardWillHide.bind(this));


        props.getKeyboardHeight(btnLocation);

    }, [focus, btnLocation]);

    return (
        <View>
            {props.hasWrapperTitle &&
                <View
                style={[wrapperTitleStyle, {backgroundColor:wrapperBackgroundColor?wrapperBackgroundColor:
                theme?.theme.WHITE_COLOR}]}>
                <View>
                    {props.wrapperTextTitle &&
                        <TextComponent styles={[wrapperTitleTextStyle]} 
                        fontFamily={DMSansBold} 
                        fontSize={16}
                        color={theme?.theme?.BLACK_COLOR} 
                        value={props.wrapperTextTitle} 
                        />}
                </View>
            </View>
            }
            <Spacer height={10} />
          
            <View
                style={[{
                    height: props.wrapperHeight,
                    width: props.wrapperWidth,
                    flexDirection: 'row',
                    backgroundColor:disabled?theme?.theme.DARK_GREY_COLOR  :theme?.theme?.WHITE_COLOR,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: showValidationError ? theme?.theme?.RED_COLOR : theme?.theme?.BLACK_COLOR,
                  justifyContent: 'center', alignItems: 'center', alignSelf: 'center',

                },
                props.textWrapperStyle
                ]}>

                {
                    props.showLeftIcon &&
                    <View style={{ height: '100%', width: 50, justifyContent: 'center', alignItems: 'center' }}>
                        {
                            props.leftText !== undefined ?
                                <TextComponent value={props.leftText} color={theme?.theme?.CURRENCY_COLOR}
                                    fontSize={16} fontFamily={DMSansMedium} />
                                :
                                <ImageComponent resizeMode={resizeMode.cover} imageType={imageTypes.local}
                                    tintColor={props.tintColor}
                                    source={props.leftIcon} height={iconHeight} width={iconWidth} />
                        }
                    </View>
                }

                {props.showLeftIcon && <Spacer bgColor={'#00000020'} height={23} width={1} />}

                <TextInput
                    ref={props.refInner}
                    numberOfLines={props.numberOfLines}
                    multiline={props.multiline}
                    editable={props?.editable}
                    onChangeText={props.onChangeText}
                    {...props.props}
                    placeholder={props.placeholder}
                    placeholderTextColor={placeholderTextColor}
                    value={props.value}
                    style={[{
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        height: '100%',
                        flex: 1,
                        color: props.color,
                        fontSize: props.fontSize,
                        fontFamily: props.fontFamily
                    }, props.styles]}
                    onFocus={(e) => {
                        setFocus(true);
                        props.onFocusChanged(true);
                    }}
                    onBlur={(e) => {
                        setFocus(false);
                        props.onFocusChanged(false);
                    }}
                    onChange={props.onChange}
                    maxLength={props.maxLength}
                    secureTextEntry={props.secureTextEntry}
                />

                {props.showRightIcon && <Spacer bgColor={'#00000020'} height={23} width={1} />}

                {props.showRightIcon &&
                    <View style={{ height: '100%', width: 50, justifyContent: 'center', alignItems: 'center' }}>
                        {
                            props.rightText !== undefined ?
                                <Text style={rightTextStyle}>{props.rightText}</Text>
                                :
                                <ImageComponent imageType={imageTypes.local} source={props.rightIcon} height={iconHeight}
                                    width={iconWidth} />
                        }
                    </View>}
                {props.rightIconVisible &&
                    <View style={{ height: '100%', width: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            props.isPasswordSecure ? props.setIsPasswordSecure(false) : props.setIsPasswordSecure(true)
                            setShowIcon(!showIcon)
                        }}>
                            <ImageComponent imageType={imageTypes.local} source={ props.isPasswordSecure ? props.rightIcon : props.closedRightIcon} height={20}
                                width={20} />
                        </TouchableOpacity>

                    </View>}

            </View>
            {
                showValidationError && <TextComponent
                    styles={[showValidationErrorStyle ? showValidationErrorStyle : { marginRight: 10 },
                    { alignSelf: 'flex-end', marginTop: 5, letterSpacing: -0.361765 }]}
                    fontFamily={DMSansMedium} 
                    fontSize={12} color={theme?.theme.FIRST_TEXT_COLOR} value={showValidationErrorMessage} />
            }

        </View>
    )
};

export default TextInputComponent;
