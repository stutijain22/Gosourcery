import { JSX, useEffect, useRef, useState } from "react";
import HeaderComponent from "../../common/HeaderComponent";
import { MainContainer2,} from "../../styling/shared";
import { getEssentials, goBack, isNetAvailable, logout, resetScreen } from "../../utils/utility";
import { Alert, View } from "react-native";
import { deviceWidth } from "../../styling/mixin";
import { DMSansMedium, DMSansSemiBold, key_setLoginToken, key_setProfileData, key_setUserId } from "../../constant/Constant";
import Spacer from "../../styling/Spacer";
import { heightPercentageToDP } from "../../utils/responsiveUI";
import TextInputComponent from "../../common/TextInputComponent";
import { K_DEFAULT, KT_DONE } from "../../constant/keyboardReturnType";
import ButtonComponent from "../../common/ButtonComponent";
import { S_LoginScreen } from "../../constant/screenNameConstants";
import { BACK_ARROW_ICON, LOGOUT_ICON, SEND_ICON } from "../../utils/sharedImages";
import { getData, getJSONData, storeJSONData } from "../../utils/AsyncStorage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { signOut } from "@aws-amplify/auth";
import { callGraphQL } from "../../aws/apollo/apolloAPIConnect";
import { GET_USER_PROFILE } from "../../aws/apollo/queryMutation/apolloQuery";
import LoaderComponent from "../../common/LoaderComponent";
import { UPDATE_USER_PROFILE } from "../../aws/apollo/queryMutation/apolloMutation";
import CommonModal from "../../common/CommonModal";
import LocationSearchBox from "../../common/LocationSearchBox";
import { YOUR_GOOGLE_API_KEY } from "../../aws-exports";

const MyAccountScreen = (props: any): JSX.Element => {
    const { navigation, theme } = getEssentials();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [locationName, setLocationName] = useState('');
    const [focus, setFocus] = useState(false);
    const [btnLocation, setButtonLocation] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [companyNameError, setCompanyNameError] = useState(false);
    const [jobTitleError, setJobTitleError] = useState(false);
    const [locationNameError, setLocationNameError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [modalVisible, setModalVisible] = useState({ title: "", key: "", value: false });
    const ref_to_name = useRef(null);
    const ref_to_email = useRef(null);
    const ref_to_company = useRef(null);
    const ref_to_jobTitle = useRef(null);
    const ref_to_location = useRef(null);
    const autoCompleteRef = useRef(null);

    useEffect(() => {
      (async () => {
        let userData:any = await getJSONData(key_setProfileData);          
        const isOnline = await isNetAvailable();
        if(!isOnline){
          await getProfileData(userData)
        }
        setIsLoading(true)
        await fetchAccountData()
      })();
    }, []);


    const fetchAccountData = async () => {
      try {
          const loginToken:any = await getData(key_setLoginToken);
          const userId:any = await getData(key_setUserId);
          const data = await callGraphQL(GET_USER_PROFILE, {
            username:userId}, loginToken,navigation);
          await storeJSONData(key_setProfileData,data?.getUserProfile)
          await getProfileData(data?.getUserProfile)
      }catch (err:any) {
        setIsLoading(false);
        // setModalVisible({ title: "Error", key: err?.message, value: true });
        console.error("❌ Failed to fetch History Data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const getProfileData = async (profileData:any) =>{
      profileData?.name && await setName(profileData?.name);
      profileData?.email && await setEmail(profileData?.email);
      profileData?.company && await setCompanyName(profileData?.company);
      profileData?.job_title && await setJobTitle(profileData?.job_title);
      profileData?.location && await setLocationName(profileData?.location);
    }

    const onFocusChanged = (isFocus: boolean | false): void => {
      setFocus(isFocus)
    };

    const getKeyboardHeight = (btnLocation: number | 0): void => {
    setButtonLocation(btnLocation);
    };

    const updateClick =async () => {
      setIsLoading(true);
      try {
        const loginToken:any = await getData(key_setLoginToken);
        const userId:any = await getData(key_setUserId);
        let userProfileInput: any = {};
        userProfileInput.name = name;
        userProfileInput.company = companyName;
        userProfileInput.job_title = jobTitle;
        userProfileInput.location =locationName;
        // userProfileInput.projectTeamRole = capitalize(lastname);
        const data = await callGraphQL(UPDATE_USER_PROFILE, {
          username:userId,
          attributes:userProfileInput}, loginToken,navigation);

        setModalVisible({ title: "Success", key: "Info Updated Successfully", value: true });
        await storeJSONData(key_setProfileData,data?.updateUserProfile)
        await getProfileData(data?.updateUserProfile)
    }catch (err:any) {
      setIsLoading(false);
      // setModalVisible({ title: "Error", key: err?.message, value: true });
      console.error("❌ Failed to fetch History Data:", err);
    } finally {
      setIsLoading(false);
    }
    }

    const logoutClick =async () => {
        try {
          await signOut();
          // Navigate to login screen or clear stored session
          await logout();
          resetScreen(navigation, S_LoginScreen)
        // await signOut({ global: true });
        } catch (error) {
          console.error('❌ Sign out error:', error);
        }
       
      }

    const validateInputs = () => {
    //   let isValid = true;
    //   Keyboard.dismiss();
    //   if (name.length === 0) {
    //     setNameError(true);
    //     ref_to_name?.current?.focus();
    //     isValid = false;
    //   } else {
    //     setNameError(false);
    //   }
    //   if (companyName.length === 0) {
    //       setCompanyNameError(true);
    //       name.length === 0 ? ref_to_name?.current?.focus() :ref_to_company?.current?.focus();
    //       isValid = false;
    //   } else {
    //     setCompanyNameError(false);
    //   }
    //   return isValid;
  }

  const handlePlaceSelect = (place: any) => {
    Alert.alert("Location Selected", JSON.stringify(place, null, 2));
  };

    return (
        <MainContainer2>
            <LoaderComponent
            isLoading={isLoading}
            loadingMessage={'Loading ... '}
        />
        <HeaderComponent
          isLeftAvailable={false}
          leftIcon={BACK_ARROW_ICON}
          leftIconStyle={{width:20,height:20,tintColor:theme?.theme.BLACK_COLOR}}
          onLeftPress={() => goBack(navigation)}
          height={50}
          middleText={'My Account'}
          fontSize={18}
          fontColor={theme?.theme?.BLACK_COLOR}
          mainContainer={{backgroundColor:theme?.theme.WHITE_COLOR}}
          isMiddleAvailable={true}
          />
          <Spacer height={heightPercentageToDP(5)} />

          <KeyboardAwareScrollView
                            keyboardShouldPersistTaps='handled'
                            enableOnAndroid={true}
                            nestedScrollEnabled
                            extraScrollHeight={0}
                            contentContainerStyle={{
                                flexGrow: 1,
                            }} // make the scrollView full screen
                            style={{flex:1}}
                            showsVerticalScrollIndicator={false}
                            // keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
                        >
<View style={{flex:1, paddingHorizontal:20}}>
          {/* <TextComponent 
          value={userEmail ? userEmail :""} 
          fontSize={25} 
          fontFamily={DMSansBold} 
          color={theme?.theme.BLACK_COLOR}
          textAlign={'center'} /> */}
          <TextInputComponent 
                        refInner={ref_to_name} 
                        getKeyboardHeight={getKeyboardHeight}
                        onFocusChanged={onFocusChanged}
                        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
                        hasWrapperTitle={true}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        onChangeText={(e: string) => {
                          setName(e)
                        }}
                        wrapperTextTitle={"Name"}
                        showValidationError={nameError}
                        showValidationErrorMessage={'Field cannot be blank'}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'Name'}
                        value={name}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_DONE,
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
                        disabled={email ? true: false}
                        editable={false}
                        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
                        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
                        hasWrapperTitle={true}
                        onChangeText={(e: string) => {
                          setEmail(e)
                        }}
                        wrapperTextTitle={"Email"}
                        // showValidationError={emailAddressError}
                        // showValidationErrorMessage={emailAddressErrorText}
                        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
                        placeholder={'Email'}
                        value={email}
                        color={theme?.theme.BLACK_COLOR}
                        fontSize={16}
                        fontFamily={DMSansMedium}
                        props={{
                            autoCapitalize: "none",
                            // onSubmitEditing: () => ref_to_password?.current?.focus(),
                            returnKeyType: KT_DONE,
                            keyboardType: K_DEFAULT
                        }} 
                        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
                          paddingHorizontal:5}}
                    />
                      <Spacer height={heightPercentageToDP(3)} />

<TextInputComponent 
        refInner={ref_to_company} 
        getKeyboardHeight={getKeyboardHeight}
        onFocusChanged={onFocusChanged}
        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
        hasWrapperTitle={true}
        onChangeText={(e: string) => {
            setCompanyName(e)
        }}
        wrapperTextTitle={"Company"}
        showValidationError={companyNameError}
        showValidationErrorMessage={'Field cannot be blank'}
        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
        placeholder={'Company'}
        value={companyName}
        color={theme?.theme.BLACK_COLOR}
        fontSize={16}
        fontFamily={DMSansMedium}
        props={{
            autoCapitalize: "none",
            // onSubmitEditing: () => ref_to_password?.current?.focus(),
            returnKeyType: KT_DONE,
            keyboardType: K_DEFAULT
        }} 
        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
          paddingHorizontal:5}}
    />
      <Spacer height={heightPercentageToDP(3)} />

<TextInputComponent 
        refInner={ref_to_jobTitle} 
        getKeyboardHeight={getKeyboardHeight}
        onFocusChanged={onFocusChanged}
        wrapperHeight={55} wrapperWidth={deviceWidth - 44}
        wrapperBackgroundColor={theme?.theme?.LIGHT_GREY_COLOR}
        hasWrapperTitle={true}
        onChangeText={(e: string) => {
            setJobTitle(e)
        }}
        wrapperTextTitle={'Job Title'}
        showValidationError={jobTitleError}
        showValidationErrorMessage={'Field cannot be blank'}
        placeholderTextColor={theme?.theme.DARK_GREY_COLOR}
        placeholder={'Job Title'}
        value={jobTitle}
        color={theme?.theme.BLACK_COLOR}
        fontSize={16}
        fontFamily={DMSansMedium}
        props={{
            autoCapitalize: "none",
            // onSubmitEditing: () => ref_to_password?.current?.focus(),
            returnKeyType: KT_DONE,
            keyboardType: K_DEFAULT
        }} 
        textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
          paddingHorizontal:5}}
    />
      <Spacer height={heightPercentageToDP(3)} />

      <LocationSearchBox 
      onPlaceSelected={(location:any) => {
}} 
wrapperHeight={55} wrapperWidth={deviceWidth - 44}
placeholder={'Search Location'}
color={theme?.theme.BLACK_COLOR}
textWrapperStyle={{letterSpacing: 1.1, borderRadius:30,
  paddingHorizontal:5}}
        fontSize={16}
        fontFamily={DMSansMedium}
/>

          <Spacer height={heightPercentageToDP(7)} />
</View>

<ButtonComponent
        title={'UPDATE'}
        onHandleClick={() => updateClick()}
        height={50}
        btnBackgroundColor={theme?.theme.WHITE_COLOR}
        borderBackgroundColor={theme?.theme.BLACK_COLOR}
        width={deviceWidth -70}
        fontColor={theme?.theme.BLACK_COLOR}
        textStyle={{ fontSize: 16, fontFamily: DMSansSemiBold, letterSpacing: 1.1 }}
        />
          <Spacer height={heightPercentageToDP(2)} />

<ButtonComponent
        title={'LOGOUT'}
        onHandleClick={() => logoutClick()}
        height={50}
        isIconAvailable={true}
        leftIcon={LOGOUT_ICON}
        iconHeight={20}
        iconWidth={20}
        tintColor={theme?.theme?.WHITE_COLOR}
        btnBackgroundColor={theme?.theme.BLUE_COLOR}
        width={deviceWidth -70}
        fontColor={theme?.theme.WHITE_COLOR}
        textStyle={{ fontSize: 16, fontFamily: DMSansSemiBold, letterSpacing: 1.1 }}
        />
        <Spacer height={heightPercentageToDP(2)} />
</KeyboardAwareScrollView>

         <CommonModal
            visible={modalVisible.value}
            headingType={modalVisible.title}
            text={modalVisible.key.toString()}
            textFontSize={modalVisible.title == "" ? 20 : 14}
            textColor={theme?.theme?.BLACK_COLOR}
            onDismiss={() => setModalVisible({ title: "", key: "", value: false })}
            buttonHeight={50}
            buttonWidth={120}
            crossIconColor={theme?.theme?.DARK_GREY_COLOR}
            headingText={modalVisible.title}
            headingTextFontSize={20}
            singleButton={true}
            positiveButtonClick={() => setModalVisible({ title: "", key: "", value: false })}
            positiveButtonText={'OK'}
            buttonBackgroundColor={theme?.theme.BLUE_COLOR}
        />
          </MainContainer2>
    );

}

export default MyAccountScreen;