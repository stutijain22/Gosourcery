import React, { useEffect, useRef, useState } from 'react';
import { emailValidation, getEssentials, getKeyboardHeight, goBack } from "../../utils/utility";
import { Keyboard, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { MainContainer, MainContainer1 } from '../../styling/shared';
import TextComponent from '../../common/TextComponent';
import Spacer from '../../styling/Spacer';
import TextInputComponent from '../../common/TextInputComponent';
import { deviceWidth } from '../../styling/mixin';
import { K_DEFAULT, K_EMAIL, KT_NEXT } from '../../constant/keyboardReturnType';
import { heightPercentageToDP } from '../../utils/responsiveUI';
import { DMSansBold, DMSansExtraBold, DMSansMedium, DMSansSemiBold } from '../../constant/Constant';
import ButtonComponent from '../../common/ButtonComponent';
import ImageComponent from '../../common/ImageComponent';
import { imageTypes, resizeMode } from '../../utils/enums';
import { BACK_ARROW_ICON } from '../../utils/sharedImages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HeaderComponent from '../../common/HeaderComponent';
import { resetPassword } from '@aws-amplify/auth';
import LoaderComponent from '../../common/LoaderComponent';
import CommonModal from '../../common/CommonModal';

const ForgotPasswordScreen = () => {
    const { navigation, theme } = getEssentials();
    const [focus, setFocus] = useState(false);
    const [btnLocation, setButtonLocation] = useState(0);
    const [emailAddress, setEmailAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailAddressError, setEmailAddressError] = useState(false);
    const [emailAddressErrorText, setEmailAddressErrorText] = useState("");
    const ref_to_emailid = useRef(null);
    const [modalVisible, setModalVisible] = useState({ title: "", key: "", value: false });

    useEffect(() => {
        if (emailAddress?.length > 0) {
            setEmailAddressError(false)
        }
    }, [emailAddress]);


    const onFocusChanged = (isFocus: boolean | false): void => {
        setFocus(isFocus)
    };
    const getKeyboardHeight = (btnLocation: number | 0): void => {
        setButtonLocation(btnLocation);
    };

    const sendClick =async () => {
        if (validateInputs()) {
            setIsLoading(true);
            try {
                const response = await resetPassword({ username: emailAddress });
                setIsLoading(false);
                setModalVisible({ title: "Success", key: "Reset code sent to your Email Address", value: true });
                goBack(navigation);
              } catch (error:any) {
                // setModalVisible({ title: "Error", key: error?.message, value: true });
                console.error('❌ Failed to send reset code:', error);
                setIsLoading(false);
                throw error;
              }
        }
    }

    const validateInputs = () => {
        let isValid = true;
        Keyboard.dismiss();
        if (emailAddress.length === 0) {
            setEmailAddressError(true);
            setEmailAddressErrorText('Field cannot be blank');
            ref_to_emailid?.current?.focus();
            isValid = false;
        } else if (!emailValidation(emailAddress)) {
            setEmailAddressError(true);
            ref_to_emailid?.current?.focus();
            setEmailAddressErrorText('Enter valid email address');
            // scrollRef?.props?.scrollToPosition(0, 100);
            isValid = false;
        } else {
            setEmailAddressError(false);
            setEmailAddressErrorText("");
        }
        return isValid;
    }

    return(
        <MainContainer1>
            <LoaderComponent
            isLoading={isLoading}
            loadingMessage={'Loading ... '}
        />
            <HeaderComponent
            isLeftAvailable={true}
            leftIcon={BACK_ARROW_ICON}
            onLeftPress={() => goBack(navigation)}
            height={50}
            />
              <KeyboardAwareScrollView
                            keyboardShouldPersistTaps="always"
                            enableOnAndroid={true}
                            // extraScrollHeight={Platform.OS === "android" ? 100 : 0}
                            contentContainerStyle={{
                                flexGrow: 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }} // make the scrollView full screen
                            // innerRef={setRef}
                            showsVerticalScrollIndicator={false}
                            // enableAutomaticScroll={true}
                        >
          

<View style={{justifyContent: 'center', alignItems: 'center',flex:1}}>


             <TextComponent fontSize={45} 
             fontFamily={DMSansSemiBold} 
             textAlign={'center'}
             styles={{ letterSpacing: 1.1 }}
            color={theme?.theme.BLACK_COLOR}
            value={'Reset your password'} />

            <Spacer height={8} />

            <TextComponent fontSize={15} 
             fontFamily={DMSansMedium} 
             textAlign={'center'}
             styles={{ letterSpacing: 1.1, paddingHorizontal: 20 }}
            color={theme?.theme?.BLACK_COLOR}
            value={`Leave us your email address and we'll send a link to reset your password`} />
            <Spacer height={heightPercentageToDP(8)} />

            <TextInputComponent 
                        refInner={ref_to_emailid} 
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={50} wrapperWidth={deviceWidth - 44}
                        hasWrapperTitle={true}
                        wrapperTextTitle={'Email*'}
                        onChangeText={(e: string) => {
                            setEmailAddress(e)
                        }}
                        showValidationError={emailAddressError}
                        showValidationErrorMessage={emailAddressErrorText}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'Email'}
                        value={emailAddress}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_NEXT,
                            keyboardType: K_EMAIL
                        }} 
                    />

        <Spacer height={50} />

        <ButtonComponent
        title={'SEND'}
        onHandleClick={() => sendClick()}
        height={50}
        btnBackgroundColor={theme?.theme.SECOND_TEXT_COLOR}
        width={deviceWidth - 44}
        fontColor={theme?.theme.WHITE_COLOR}
        textStyle={{ fontSize: 16, fontFamily: DMSansSemiBold, letterSpacing: 1.1 }}
        iconStyle={{}}
        />
</View>
</KeyboardAwareScrollView>
<CommonModal
            visible={modalVisible.value}
            headingType={modalVisible.title}
            text={modalVisible.key.toString()}
            textFontSize={modalVisible.title == "" ? 20 : 12}
            textColor={theme?.theme?.BLACK_COLOR}
            onDismiss={() => setModalVisible({ title: "", key: "", value: false })}
            buttonHeight={50}
            buttonWidth={120}
            crossIcon={true}
            headingText={modalVisible.title}
            headingTextFontSize={20}
            buttonBackgroundColor={theme?.theme.BLUE_COLOR}
            singleButton={true}
            positiveButtonClick={() => setModalVisible({ title: "", key: "", value: false })}
            positiveButtonText={'OK'}
        />
        </MainContainer1>
    )
}

export default ForgotPasswordScreen;
