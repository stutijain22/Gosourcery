import React, {useEffect, useRef, useState} from 'react';
import {
  emailValidation,
  getEssentials,
  navigateScreen,
} from '../../utils/utility';
import {Keyboard, Linking, TouchableOpacity} from 'react-native';
import {MainContainer} from '../../styling/shared';
import TextComponent from '../../common/TextComponent';
import Spacer from '../../styling/Spacer';
import TextInputComponent from '../../common/TextInputComponent';
import {deviceWidth} from '../../styling/mixin';
import {K_DEFAULT, K_EMAIL, KT_NEXT} from '../../constant/keyboardReturnType';
import {heightPercentageToDP} from '../../utils/responsiveUI';
import {
  DMSansExtraBold,
  DMSansMedium,
  DMSansSemiBold,
  key_setLoginToken,
  key_setUserId,
} from '../../constant/Constant';
import ButtonComponent from '../../common/ButtonComponent';
import {S_BottomTabsDashboard} from '../../constant/screenNameConstants';
import {EYE_IMAGE, HIDDEN_EYE_IMAGE} from '../../utils/sharedImages';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LoaderComponent from '../../common/LoaderComponent';
import {storeData} from '../../utils/AsyncStorage';
import CommonModal from '../../common/CommonModal';
import {fetchAuthSession, signIn, signOut} from '@aws-amplify/auth';
import {forgotPasswordUrl} from '../../aws-exports';
import HeaderComponent from '../../common/HeaderComponent';

const LoginScreen = () => {
  const {navigation, theme} = getEssentials();
  const [focus, setFocus] = useState(false);
  const [btnLocation, setButtonLocation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  //   const [emailAddress, setEmailAddress] = useState('');
  //   const [password, setPassword] = useState('');
  const [emailAddress, setEmailAddress] = useState('msingh@gosourcery.com');
  const [password, setPassword] = useState('dajhe3-Deprab-nohpag');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [modalVisible, setModalVisible] = useState({
    title: '',
    key: '',
    key2: '',
    value: false,
  });
  const [emailAddressError, setEmailAddressError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailAddressErrorText, setEmailAddressErrorText] = useState('');
  const ref_to_emailid = useRef(null);
  const ref_to_password = useRef(null);

  useEffect(() => {
    if (emailAddress?.length > 0) {
      setEmailAddressError(false);
    }
    if (password?.length > 0) {
      setPasswordError(false);
    }
  }, [emailAddress, password]);

  const onFocusChanged = (isFocus: boolean | false): void => {
    setFocus(isFocus);
  };
  const getKeyboardHeight = (btnLocation: number | 0): void => {
    setButtonLocation(btnLocation);
  };

  const loginClick = async () => {
    if (validateInputs()) {
      Keyboard.dismiss();
      setIsLoading(true);
      try {
        await signIn({username: emailAddress, password: password});
        const session = await fetchAuthSession();
        const tokenKey: any = session.tokens?.idToken?.payload;
        const badgeAccess = tokenKey?.['custom:badge_scanner_access'];
        if (badgeAccess) {
          const idToken: any = session.tokens?.idToken?.toString();
          const userId: any = session?.userSub?.toString();
          await storeData(key_setLoginToken, idToken);
          await storeData(key_setUserId, userId);
          navigateScreen(navigation, S_BottomTabsDashboard);
        } else {
          await signOut();
          setModalVisible({
            title: 'Ooops!',
            key: 'You are not subscribed to the badge scanner app. To subscribe contact us at',
            key2: 'info@gosourcery.com',
            value: true,
          });
        }

        setIsLoading(false);
      } catch (err: any) {
        setModalVisible({
          title: 'Error',
          key: err?.message,
          key2: '',
          value: true,
        });
        setIsLoading(false);
        throw err;
      }
    }
  };

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
      isValid = false;
    } else {
      setEmailAddressError(false);
      setEmailAddressErrorText('');
    }
    if (password.length === 0) {
      setPasswordError(true);
      ref_to_password?.current?.focus();
      emailAddress.length === 0
        ? ref_to_emailid?.current?.focus()
        : ref_to_password?.current?.focus();
      isValid = false;
    } else {
      setPasswordError(false);
    }
    return isValid;
  };

  const clickForgotPassword = () => {
    Linking.openURL(forgotPasswordUrl);
  };

  return (
    <MainContainer>
      <LoaderComponent isLoading={isLoading} loadingMessage={'Loading ... '} />
      <HeaderComponent />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }} // make the scrollView full screen
        showsVerticalScrollIndicator={false}>
        <TextComponent
          fontSize={50}
          fontFamily={DMSansSemiBold}
          textAlign={'center'}
          styles={{letterSpacing: 1.1}}
          color={theme?.theme.BLACK_COLOR}
          value={'Login'}
        />

        <Spacer height={8} />

        <TextComponent
          fontSize={15}
          fontFamily={DMSansMedium}
          textAlign={'center'}
          styles={{letterSpacing: 1.1, paddingHorizontal: 20}}
          color={theme?.theme?.BLACK_COLOR}
          value={'Experience the difference Sourcery makes.'}
        />
        <Spacer height={heightPercentageToDP(10)} />

        <TextInputComponent
          refInner={ref_to_emailid}
          getKeyboardHeight={getKeyboardHeight}
          onFocusChanged={onFocusChanged}
          wrapperHeight={50}
          wrapperWidth={deviceWidth - 44}
          hasWrapperTitle={true}
          wrapperTextTitle={'Email*'}
          onChangeText={(e: string) => {
            setEmailAddress(e);
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
            autoCapitalize: 'none',
            onSubmitEditing: () => ref_to_password?.current?.focus(),
            returnKeyType: KT_NEXT,
            keyboardType: K_EMAIL,
          }}
          textWrapperStyle={{letterSpacing: 1.1}}
        />

        <Spacer height={30} />

        <TextInputComponent
          refInner={ref_to_password}
          getKeyboardHeight={getKeyboardHeight}
          onFocusChanged={onFocusChanged}
          wrapperHeight={50}
          wrapperWidth={deviceWidth - 44}
          hasWrapperTitle={true}
          wrapperTextTitle={'Password*'}
          onChangeText={(e: string) => {
            setPassword(e);
          }}
          showValidationError={passwordError}
          showValidationErrorMessage={'Field cannot be blank'}
          placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
          placeholder={'Password'}
          value={password}
          color={theme?.theme.BLACK_COLOR}
          fontSize={16}
          fontFamily={DMSansMedium}
          secureTextEntry={isPasswordSecure}
          rightIcon={EYE_IMAGE}
          rightIconVisible={true}
          isPasswordSecure={isPasswordSecure}
          closedRightIcon={HIDDEN_EYE_IMAGE}
          setIsPasswordSecure={setIsPasswordSecure}
          props={{
            autoCapitalize: 'none',
            // onSubmitEditing: () => ref_to_address?.current?.focus(),
            returnKeyType: KT_NEXT,
            keyboardType: K_DEFAULT,
          }}
          textWrapperStyle={{letterSpacing: 1.1}}
        />
        <Spacer height={30} />

        <ButtonComponent
          title={'LOG IN'}
          onHandleClick={() => loginClick()}
          height={50}
          btnBackgroundColor={theme?.theme.SECOND_TEXT_COLOR}
          width={deviceWidth - 44}
          fontColor={theme?.theme.WHITE_COLOR}
          textStyle={{
            fontSize: 16,
            fontFamily: DMSansSemiBold,
            letterSpacing: 1.1,
          }}
          iconStyle={{}}
        />

        <Spacer height={20} />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => clickForgotPassword()}>
          <TextComponent
            fontSize={16}
            fontFamily={DMSansExtraBold}
            styles={{letterSpacing: 1.1}}
            textDecorationLine="underline"
            color={theme?.theme.BLACK_COLOR}
            value={'Forgot your Password?'}
          />
        </TouchableOpacity>
      </KeyboardAwareScrollView>
      <CommonModal
        visible={modalVisible.value}
        headingType={modalVisible.title}
        text={modalVisible.key.toString()}
        text2={modalVisible.key2.toString()}
        textFontSize={modalVisible.title == '' ? 20 : 14}
        textColor={theme?.theme?.BLACK_COLOR}
        text2FontSize={14}
        textColor2={theme?.theme?.BLUE_COLOR}
        onDismiss={() =>
          setModalVisible({title: '', key: '', key2: '', value: false})
        }
        buttonHeight={50}
        buttonWidth={120}
        crossIcon={true}
        headingText={modalVisible.title}
        headingTextFontSize={20}
        buttonBackgroundColor={theme?.theme.SECOND_TEXT_COLOR}
        singleButton={true}
        positiveButtonClick={() =>
          setModalVisible({title: '', key: '', key2: '', value: false})
        }
        positiveButtonText={'OK'}
      />
    </MainContainer>
  );
};

export default LoginScreen;
