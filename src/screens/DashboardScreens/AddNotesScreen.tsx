import { JSX, useEffect, useRef, useState } from "react";
import HeaderComponent from "../../common/HeaderComponent";
import { MainContainer1, MainContainer2, shadowStyle } from "../../styling/shared";
import { emailValidation, formatPhoneNumber, getEssentials, getKeyboardHeight, goBack, isNetAvailable, navigateScreen } from "../../utils/utility";
import { Keyboard, Platform, View } from "react-native";
import { deviceHeight, deviceWidth } from "../../styling/mixin";
import { DMSansBold, DMSansMedium, DMSansSemiBold, key_selectCollection, key_selectWorkSpace, key_setLoginToken, key_setUserData, key_setUserId, key_setUserScanData } from "../../constant/Constant";
import Spacer from "../../styling/Spacer";
import { heightPercentageToDP } from "../../utils/responsiveUI";
import TextInputComponent from "../../common/TextInputComponent";
import { K_DEFAULT, K_NUMERIC, KT_DONE, KT_NEXT } from "../../constant/keyboardReturnType";
import ButtonComponent from "../../common/ButtonComponent";
import styles from "./styles";
import { S_BottomTabsDashboard, S_WorkSpaceScreen } from "../../constant/screenNameConstants";
import { BACK_ARROW_ICON, SEND_ICON } from "../../utils/sharedImages";
import { getData, getJSONData, storeJSONData } from "../../utils/AsyncStorage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { eventId } from "../../aws-exports";
import { callGraphQL } from "../../aws/apollo/apolloAPIConnect";
import { SEND_BADGE_SCANNER_EMAIL } from "../../aws/apollo/queryMutation/apolloMutation";
import LoaderComponent from "../../common/LoaderComponent";
import CommonModal from "../../common/CommonModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AddNotesScreen = (props: any): JSX.Element => {
    const { navigation, theme } = getEssentials();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [stateValue, setStateValue] = useState("");
    const [countryValue, setCountryValue] = useState("");
    const [cityValue, setCityValue] = useState("");
    const [addressValue, setAddressValue] = useState("");
    const [userNotes, setUserNotes] = useState("");
    const [focus, setFocus] = useState(false);
    const [btnLocation, setButtonLocation] = useState(0);
    const [emailAddressError, setEmailAddressError] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailAddressErrorText, setEmailAddressErrorText] = useState("");
    const { userData, keyData } = props?.route?.params ?? "";
    const [modalVisible, setModalVisible] = useState({ title: "", key: "", value: false });
    const ref_to_first_name = useRef(null);
    const ref_to_last_name = useRef(null);
    const ref_to_email = useRef(null);
    const ref_to_notes = useRef(null);
    const insets = useSafeAreaInsets();

    useEffect(() => {
      (async () => {
        if(userData){
          userData?.userEmail &&  await setEmail(userData?.userEmail)
          userData?.userFirstName &&  await setFirstName(userData?.userFirstName)
          userData?.userLastName &&  await setLastName(userData?.userLastName)
          userData?.userBusinessType &&  await setBusinessType(userData?.userBusinessType)
          userData?.userCompanyName &&  await setCompanyName(userData?.userCompanyName)
          userData?.userAddress &&  await setAddressValue(userData?.userAddress)
          userData?.userCity &&  await setCityValue(userData?.userCity)
          userData?.userState &&  await setStateValue(userData?.userState)
          userData?.userZip &&  await setZipCode(userData?.userZip)
          userData?.userCountry &&  await setCountryValue(userData?.userCountry)
          userData?.userPhoneNumber &&  await setPhoneNumber(userData?.userPhoneNumber)
        }
          // userName &&await setName(userName)
      })();
    }, [userData]);

    useEffect(() => {

      if (email?.length > 0) {
          setEmailAddressError(false)
      }
      if (firstName?.length > 0) {
        setFirstNameError(false)
      }
      if (lastName?.length > 0) {
        setLastNameError(false)
      }
  }, [email, firstName,lastName]);

    // useEffect(() => {
    //   const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
    //     setKeyboardVisible(true);
    //   });
    //   const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
    //     setKeyboardVisible(false);
    //   });

    //   return () => {
    //     keyboardDidShowListener.remove();
    //     keyboardDidHideListener.remove();
    //   };
    // }, []);

    const onFocusChanged = (isFocus: boolean | false): void => {
      setFocus(isFocus)
    };

    const getKeyboardHeight = (btnLocation: number | 0): void => {
    setButtonLocation(btnLocation);
    };

    const saveClick =async () => {
      let userData = await getJSONData(key_setUserData);
      let selectCollection:any = await getJSONData(key_selectCollection);  
      let selectWorkSpace:any = await getJSONData(key_selectWorkSpace);  
      let userDataOnSave = {
        firstName: firstName && firstName,
        lastName: lastName && lastName,
        phoneNumber: phoneNumber,
        companyName: companyName,
        businessType: businessType,
        zip: zipCode,
        state: stateValue,
        country: countryValue,
        city: cityValue,
        address: addressValue,
        clientEmail: email,
        notes: userNotes,
        emailStatus: 'pending',
        collectionId:selectCollection && selectCollection?.id,
        collectionName: selectCollection && selectCollection?.name,
        workspaceId :selectWorkSpace && selectWorkSpace?.id,
        workspaceName: selectWorkSpace && selectWorkSpace?.name,
        timestamp: new Date().toISOString(),
        eventId:eventId,
      }
      if(userData && userData?.length > 0){
      userData.push(userDataOnSave);
      setIsLoading(false);
      await storeJSONData(key_setUserData, userData);
      setModalVisible({ title: "Success", key: "Data Sent Successfully", value: true });
      }else{
        setIsLoading(false);
        await storeJSONData(key_setUserData, [userDataOnSave]);
        setModalVisible({ title: "Success", key: "Data Sent Successfully", value: true });
      }
    }

    const sendClick =async () => {
      const isOnline = await isNetAvailable();
       if(validateInputs()){
     await setIsLoading(true);

      if(!isOnline){
        await saveClick()
      }else{
        try {
          const loginToken:any = await getData(key_setLoginToken);
        const userId:any = await getData(key_setUserId);
        let selectCollection:any = await getJSONData(key_selectCollection);  
        let selectWorkSpace:any = await getJSONData(key_selectWorkSpace); 
        let scanQrData:any = await getData(key_setUserScanData); 
      
          const data = await callGraphQL(SEND_BADGE_SCANNER_EMAIL, {
            "firstName": firstName && firstName,
            "lastName": lastName && lastName,
            "phoneNumber": phoneNumber,
            "companyName": companyName,
            "businessType": businessType,
            "zip": zipCode,
            "state": stateValue,
            "country": countryValue,
            "city": cityValue,
            "address": addressValue,
          "clientEmail" : email,
          "collectionId" : selectCollection && selectCollection?.id,
          "collectionName" :selectCollection && selectCollection?.name,
          "eventId" :eventId,
          "notes" :userNotes,
          "rawInfo" :keyData == "enterManual" ? "" :scanQrData && scanQrData,
          "userId" :userId,
          "workspaceId" :selectWorkSpace && selectWorkSpace?.id,
          "workspaceName" :selectWorkSpace && selectWorkSpace?.name,
          "resend": false
            }, loginToken,navigation); 
          setModalVisible({ title: "Success", key: "Data Sent Successfully", value: true });
          
          // await setWorkSpaceList(data?.listMyWorkspaces?.data);
          // await storeJSONData(key_setWorkspaceList,data?.listMyWorkspaces?.data)
          setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error("❌ Failed to fetch workspaces:", err);
      } finally {
        setIsLoading(false);
  }}}}

    const validateInputs = () => {
      let isValid = true;
      Keyboard.dismiss();
      if (firstName.length === 0) {
        setFirstNameError(true);
        ref_to_first_name?.current?.focus();
        isValid = false;
      } else {
        setFirstNameError(false);
      }
      if (lastName.length === 0) {
        setLastNameError(true);
        firstName.length === 0 ? ref_to_first_name?.current?.focus() :ref_to_last_name?.current?.focus();
        isValid = false;
      } else {
        setLastNameError(false);
      }
      if (email.length === 0) {
          setEmailAddressError(true);
          setEmailAddressErrorText('Field cannot be blank');
          firstName.length === 0 ? ref_to_first_name?.current?.focus() :
          lastName.length === 0 ? ref_to_last_name?.current?.focus():ref_to_email?.current?.focus();
          isValid = false;
      } else if (!emailValidation(email)) {
          setEmailAddressError(true);
          firstName.length === 0 ? ref_to_first_name?.current?.focus() :
          lastName.length === 0 ? ref_to_last_name?.current?.focus():ref_to_email?.current?.focus();
          setEmailAddressErrorText('Enter valid email address');
          // scrollRef?.props?.scrollToPosition(0, 100);
          isValid = false;
      } else {
          setEmailAddressError(false);
          setEmailAddressErrorText("");
      }
      return isValid;
  }

  const buttonClick = () =>{
    if(modalVisible.title == 'Success'){
    setModalVisible({ title: "", key: "", value: false })
      navigateScreen(navigation,S_BottomTabsDashboard);
    }
  }
  let scrollRef: any;
  const setRef = (c: any) => {
      scrollRef = c;
  };

    return (
      <MainContainer2>
          <LoaderComponent
            isLoading={isLoading}
            loadingMessage={'Loading ... '}
        />
        <HeaderComponent
          isLeftAvailable={true}
          leftIcon={BACK_ARROW_ICON}
          leftIconStyle={{width:20,height:20,tintColor:theme?.theme.BLACK_COLOR}}
          onLeftPress={() => navigateScreen(navigation, S_BottomTabsDashboard)}
          height={50}
          middleText={'Add Notes'}
          fontSize={18}
          fontColor={theme?.theme?.BLACK_COLOR}
          mainContainer={{backgroundColor:theme?.theme.WHITE_COLOR}}
          isMiddleAvailable={true}
          />
          <Spacer height={heightPercentageToDP(5)} />

          <KeyboardAwareScrollView
                            enableOnAndroid={true}
                            scrollEnabled={true}
                            innerRef={setRef}
                            enableAutomaticScroll={true} // ✅ allow automatic scroll
                            extraScrollHeight={Platform.OS === "android" ? 150 : 20} // ✅ shift extra space
                            showsVerticalScrollIndicator={false}
                            keyboardOpeningTime={0} // ✅ let it trigger immediately
                            // extraScrollHeight={0}         // ⛔️ disables scroll shift
                            contentContainerStyle={{
                              flexGrow: 1,
                              paddingBottom: insets.bottom + 30, // leave space for footer
                            }}
                            // style={{flex:1}}
                        >
<View style={{flex:1,paddingHorizontal:20}}>
          {/* <TextComponent 
          value={userEmail ? userEmail :""} 
          fontSize={25} 
          fontFamily={DMSansBold} 
          color={theme?.theme.BLACK_COLOR}
          textAlign={'center'} /> */}
          <TextInputComponent 
                        refInner={ref_to_first_name} 
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
                        hasWrapperTitle={true}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        onChangeText={(e: string) => {
                          setFirstName(e)
                        }}
                        wrapperTextTitle={"First Name"}
                        showValidationError={firstNameError}
                        showValidationErrorMessage={'Field cannot be blank'}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'First Name'}
                        value={firstName}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_NEXT,
                            keyboardType: K_DEFAULT
                        }} 
                        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
                          paddingHorizontal:5
                        }}
                    />
                     <Spacer height={heightPercentageToDP(3)} />
                     <TextInputComponent 
                        refInner={ref_to_last_name} 
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
                        hasWrapperTitle={true}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        onChangeText={(e: string) => {
                          setLastName(e)
                        }}
                        wrapperTextTitle={"Last Name"}
                        showValidationError={lastNameError}
                        showValidationErrorMessage={'Field cannot be blank'}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'Last Name'}
                        value={lastName}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_NEXT,
                            keyboardType: K_DEFAULT
                        }} 
                        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
                          paddingHorizontal:5
                        }}
                    />
                     <Spacer height={heightPercentageToDP(3)} />

                <TextInputComponent 
                        refInner={ref_to_email} 
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        hasWrapperTitle={true}
                        onChangeText={(e: string) => {
                          setEmail(e)
                        }}
                        wrapperTextTitle={"Email"}
                        showValidationError={emailAddressError}
                        showValidationErrorMessage={emailAddressErrorText}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'Email'}
                        value={email}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_NEXT,
                            keyboardType: K_DEFAULT
                        }} 
                        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
                          paddingHorizontal:5}}
                    />
          <Spacer height={heightPercentageToDP(4)} />

          <TextInputComponent
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        hasWrapperTitle={true}
                        onChangeText={(e: string) => {
                          // setPhoneNumber(e)
                          setPhoneNumber(formatPhoneNumber(e))
                        }}
                        wrapperTextTitle={"Phone Number (Optional)"}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'Phone Number'}
                        value={phoneNumber}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        maxLength={12}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_NEXT,
                            keyboardType: K_NUMERIC
                        }} 
                        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
                          paddingHorizontal:5}}
                    />
          <Spacer height={heightPercentageToDP(4)} />

          <TextInputComponent 
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        hasWrapperTitle={true}
                        onChangeText={(e: string) => {
                          setCompanyName(e)
                        }}
                        wrapperTextTitle={"Company Name (Optional)"}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'Company Name'}
                        value={companyName}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_NEXT,
                            keyboardType: K_DEFAULT
                        }} 
                        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
                          paddingHorizontal:5}}
                    />
          <Spacer height={heightPercentageToDP(4)} />

          <TextInputComponent 
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        hasWrapperTitle={true}
                        onChangeText={(e: string) => {
                          setBusinessType(e)
                        }}
                        wrapperTextTitle={"Business Type (Optional)"}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'Business Type'}
                        value={businessType}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_NEXT,
                            keyboardType: K_DEFAULT
                        }} 
                        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
                          paddingHorizontal:5}}
                    />
          <Spacer height={heightPercentageToDP(4)} />
          <TextInputComponent 
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        hasWrapperTitle={true}
                        onChangeText={(e: string) => {
                          setAddressValue(e)
                        }}
                        wrapperTextTitle={"Address (Optional)"}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'Address'}
                        value={addressValue}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_NEXT,
                            keyboardType: K_DEFAULT
                        }} 
                        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
                          paddingHorizontal:5}}
                    />
          <Spacer height={heightPercentageToDP(4)} />

          <TextInputComponent 
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        hasWrapperTitle={true}
                        onChangeText={(e: string) => {
                          setZipCode(e)
                        }}
                        wrapperTextTitle={"Zip Code (Optional)"}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'Zip Code'}
                        value={zipCode}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_NEXT,
                            keyboardType: K_DEFAULT
                        }} 
                        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
                          paddingHorizontal:5}}
                    />
          <Spacer height={heightPercentageToDP(4)} />

          <TextInputComponent 
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        hasWrapperTitle={true}
                        onChangeText={(e: string) => {
                          setStateValue(e)
                        }}
                        wrapperTextTitle={"State (Optional)"}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'State'}
                        value={stateValue}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_NEXT,
                            keyboardType: K_DEFAULT
                        }} 
                        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
                          paddingHorizontal:5}}
                    />
          <Spacer height={heightPercentageToDP(4)} />

          <TextInputComponent 
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        hasWrapperTitle={true}
                        onChangeText={(e: string) => {
                          setCountryValue(e)
                        }}
                        wrapperTextTitle={"Country (Optional)"}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'Country'}
                        value={countryValue}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_NEXT,
                            keyboardType: K_DEFAULT
                        }} 
                        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
                          paddingHorizontal:5}}
                    />
          <Spacer height={heightPercentageToDP(4)} />

          <TextInputComponent 
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        hasWrapperTitle={true}
                        onChangeText={(e: string) => {
                          setCityValue(e)
                        }}
                        wrapperTextTitle={"City (Optional)"}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'City'}
                        value={cityValue}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_NEXT,
                            keyboardType: K_DEFAULT
                        }} 
                        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
                          paddingHorizontal:5}}
                    />
          <Spacer height={heightPercentageToDP(4)} />

          <TextInputComponent 
                        refInner={ref_to_notes} 
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={200} wrapperWidth={deviceWidth - 44}
                        hasWrapperTitle={true}
                        onChangeText={(e: string) => {
                          setUserNotes(e)
                        }}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        multiline={true}
                        // showValidationError={emailAddressError}
                        // showValidationErrorMessage={emailAddressErrorText}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'Notes are private to you and not sent to the client'}
                        wrapperTextTitle={'Notes (Optional)'}
                        value={userNotes}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_NEXT,
                            keyboardType: K_DEFAULT
                        }} 
                        styles={{textAlignVertical: 'top', }}
                        textWrapperStyle={{letterSpacing: 1.1,borderRadius:10,
                          paddingHorizontal:5}}
                    />
          <Spacer height={heightPercentageToDP(7)} />

{/* <View style={[styles.rowStyle,{marginHorizontal: 20}]}>
<ButtonComponent
        title={'SAVE'}
        onHandleClick={() => saveClick()}
        height={50}
        btnBackgroundColor={theme?.theme.BLUE_COLOR}
        width={deviceWidth/ 2.5}
        fontColor={theme?.theme.WHITE_COLOR}
        textStyle={{ fontSize: 16, fontFamily: DMSansSemiBold, letterSpacing: 1.1 }}
        iconStyle={{}}
        /> */}
</View>
</KeyboardAwareScrollView>

{/* {!keyboardVisible && */}
<View style={{position: 'absolute',
          bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme?.theme?.WHITE_COLOR, // full-width footer background
    paddingBottom: insets.bottom + 10, // safe area for iOS/Android
    paddingTop: 10,
    alignItems: 'center',
}}>
<ButtonComponent
        title={'SEND EMAIL'}
        onHandleClick={() => sendClick()}
        height={50}
        isIconAvailable={true}
        leftIcon={SEND_ICON}
        iconHeight={20}
        iconWidth={20}
        tintColor={theme?.theme?.WHITE_COLOR}
        btnBackgroundColor={theme?.theme.BLUE_COLOR}
        width={deviceWidth -70}
        fontColor={theme?.theme.WHITE_COLOR}
        textStyle={{ fontSize: 16, fontFamily: DMSansSemiBold, letterSpacing: 1.1 }}
        />
        </View>
{/* } */}
        {/* <Spacer height={heightPercentageToDP(3)} /> */}

        <CommonModal
            visible={modalVisible.value}
            headingType={modalVisible.title}
            text={modalVisible.key.toString()}
            textFontSize={modalVisible.title == "" ? 20 : 12}
            textColor={theme?.theme?.BLACK_COLOR}
            onDismiss={() => setModalVisible({ title: "", key: "", value: false })}
            buttonHeight={50}
            buttonWidth={120}
            crossIcon={false}
            headingText={modalVisible.title}
            headingTextFontSize={20}
            buttonBackgroundColor={theme?.theme.BLUE_COLOR}
            singleButton={true}
            positiveButtonClick={() => buttonClick()}
            positiveButtonText={'OK'}
        />
          </MainContainer2>
    );

}

export default AddNotesScreen;