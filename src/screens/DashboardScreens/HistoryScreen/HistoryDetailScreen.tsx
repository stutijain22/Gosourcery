import React, {useState } from 'react';
import HeaderComponent from "../../../common/HeaderComponent";     
import { MainContainer2} from "../../../styling/shared";
import { getEssentials, goBack, navigateScreen } from "../../../utils/utility";
import { DMSansBold, DMSansMedium, DMSansSemiBold, key_selectCollection, key_selectWorkSpace, key_setHistoryPendingList, key_setLoginToken, key_setUserData, key_setUserId, key_setUserScanData} from '../../../constant/Constant';
import { Platform, View } from 'react-native';
import Spacer from '../../../styling/Spacer';
import styles from '../styles';
import TextComponent from '../../../common/TextComponent';
import { BACK_ARROW_ICON, SEND_ICON } from '../../../utils/sharedImages';
import moment from 'moment';
import LoaderComponent from '../../../common/LoaderComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonComponent from '../../../common/ButtonComponent';
import { deviceWidth } from '../../../styling/mixin';
import { getData, getJSONData, storeJSONData } from '../../../utils/AsyncStorage';
import { SEND_BADGE_SCANNER_EMAIL } from '../../../aws/apollo/queryMutation/apolloMutation';
import { callGraphQL } from '../../../aws/apollo/apolloAPIConnect';
import { S_BottomTabsDashboard } from '../../../constant/screenNameConstants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const InfoRow = ({ label, value }: { label: string, value: string }) => {
    const { theme } = getEssentials();
    return (
      <View style={{
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
      }}>
        <TextComponent
          value={label}
          fontSize={15}
          fontFamily={DMSansBold}
          color={theme?.theme.BLACK_COLOR}
          styles={{ width: deviceWidth/2 }}
        />
        <TextComponent
          value={value || '-' }
          fontSize={15}
          fontFamily={DMSansMedium}
          color={theme?.theme.BLACK_COLOR}
          styles={{ flex: 1, flexWrap: 'wrap' }}
        />
      </View>
    );
  };

const HistoryDetailScreen = (props:any) => {
    const { navigation, theme } = getEssentials();
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisibleOne, setModalVisibleOne] = useState<any>({key: "", value: false});
    const {itemDetail, refresh} = props?.route?.params ?? '';
    const insets = useSafeAreaInsets();

const sendClick =async () =>{
  await setIsLoading(true);
  try {
  const loginToken:any = await getData(key_setLoginToken);
  const userId:any = await getData(key_setUserId);
  let selectCollection:any = await getJSONData(key_selectCollection);  
  let selectWorkSpace:any = await getJSONData(key_selectWorkSpace); 
  let scanQrData:any = await getData(key_setUserScanData);  
    const data = await callGraphQL(SEND_BADGE_SCANNER_EMAIL, {
      "firstName": itemDetail?.firstName,
        "lastName": itemDetail?.lastName,
        "phoneNumber": itemDetail?.phoneNumber,
        "companyName": itemDetail?.companyName,
        "businessType": itemDetail?.businessType,
        "zip": itemDetail?.zip,
        "state": itemDetail?.state,
        "country": itemDetail?.country,
        "city": itemDetail?.city,
        "address": itemDetail?.address,
    "clientEmail" : itemDetail?.clientEmail,
    "collectionId" : selectCollection && selectCollection?.id,
    "collectionName" :selectCollection && selectCollection?.name,
    "eventId" :itemDetail?.eventId,
    "notes" :itemDetail?.notes,
    "rawInfo" : scanQrData ? scanQrData :"",
    "userId" :userId,
    "workspaceId" :selectWorkSpace && selectWorkSpace?.id,
    "workspaceName" :selectWorkSpace && selectWorkSpace?.name,
    "resend": false
      }, loginToken,navigation);

     // ✅ Remove the sent item from local pending storage
     const localData: any[] = await getJSONData(key_setUserData) || [];

     // Define a unique key to match (based on transactionId or fallback combo)
     const sentKey = itemDetail.transactionId || `${itemDetail.clientEmail}_${itemDetail.collectionId}`;
 
     const updatedLocalData = localData.filter((item) => {
       const key = item.transactionId || `${item.clientEmail}_${item.collectionId}`;
       return key !== sentKey;
     });
 
     await storeJSONData(key_setUserData, updatedLocalData);
     await storeJSONData(key_setHistoryPendingList, updatedLocalData);
 
     // Optional: refresh list in parent screen
     await refresh?.();
    goBack(navigation);
  //  navigateScreen(navigation,S_BottomTabsDashboard);
    }catch (err) {
      setIsLoading(false);
      console.error("❌ Failed to fetch workspaces:", err);
    } finally {
      setIsLoading(false);
    }
}

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
          onLeftPress={() => goBack(navigation)}
          height={50}
          middleText={'Lead Details'}
          fontSize={18}
          fontColor={theme?.theme?.BLACK_COLOR}
          mainContainer={{backgroundColor:theme?.theme.WHITE_COLOR}}
          isMiddleAvailable={true}
          />
          {/* <View style={styles.columnStyle}> */}
            <Spacer height={10} />

      <KeyboardAwareScrollView
       enableOnAndroid={true}
      //  extraHeight={100}
       style={{ flex: 1 }}
        extraScrollHeight={Platform.OS === "android" ? 100 : 20} // push content up
        keyboardOpeningTime={0}
        enableAutomaticScroll={true} // ✅ allow automatic scroll
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 80, // leave space for footer
        }}
       showsVerticalScrollIndicator={false}>

        <View style={styles.modalViewStyle}>
          {/* <View style={styles.rowStyleFour}> */}
          <View style={[styles.imageViewStyleOne,{
            backgroundColor: theme?.theme.BLUE_COLOR,
            alignSelf:'center',
          }]}>
          <TextComponent
          fontSize={30} 
             fontFamily={DMSansBold} 
             textAlign={'center'}
             styles={{ letterSpacing: 1.1 }}
            color={theme?.theme.WHITE_COLOR}
            value={itemDetail?.firstName?.charAt(0).toUpperCase() + itemDetail?.lastName?.charAt(0).toUpperCase()} />
          {/* </View> */}
          <Spacer width={30}/>
          {/* <View style={{flex:1}}>
          <TextComponent value={itemDetail?.clientName} 
            fontSize={18} 
            styles={{flexwrap:'wrap',flexShrink:1}}
            fontFamily={DMSansBold} 
            color={theme?.theme.BLACK_COLOR} />

            <TextComponent value={itemDetail?.clientEmail} 
            fontSize={18} 
            styles={{flexwrap:'wrap',flexShrink:1}}
            fontFamily={DMSansMedium} 
            color={theme?.theme.BLACK_COLOR} />
            </View> */}
          </View>

              {/* Info List */}
              <Spacer height={30} />
              <InfoRow label="Client Name" value={itemDetail?.firstName || itemDetail?.lastName ? `${itemDetail?.firstName || ''} ${itemDetail?.lastName || ''}`.trim() : '-'} />
              <InfoRow label="Client Email" value={itemDetail?.clientEmail || '-'} />
              <InfoRow label="Phone Number" value={itemDetail?.phoneNumber || '-'} />
              <InfoRow label="Company Name" value={itemDetail?.companyName || '-'} />
              <InfoRow label="Business Type" value={itemDetail?.businessType || '-'} />
              <InfoRow label="Event ID" value={itemDetail?.eventId || '-'} />
              <InfoRow label="Collection" value={itemDetail?.collectionName || '-'} />
              <InfoRow label="Workspace" value={itemDetail?.workspaceName || '-'} />
              <InfoRow label="Notes" value={itemDetail?.notes || '-'} />
              <InfoRow label="Address" value={itemDetail?.address || '-'} />
              <InfoRow label="Zip Code" value={itemDetail?.zip || '-'} />
              <InfoRow label="State" value={itemDetail?.state || '-'} />
              <InfoRow label="Country" value={itemDetail?.country || '-'} />
              <InfoRow label="City" value={itemDetail?.city || '-'} />
              <InfoRow label="Timestamp" value={itemDetail?.timestamp ? moment(itemDetail.timestamp).format('DD MMM YYYY, hh:mm A') : '-'} />
            
            
              {/* {itemDetail?.city && <InfoRow label="City" value={itemDetail?.city} />} */}
          <Spacer height={30} />

{itemDetail?.emailStatus== 'sent' ?
<TextComponent 
            value={'✔ Sent'} 
            fontSize={30} 
            textAlign='center'
            fontFamily={DMSansBold} 
            color={theme?.theme.GREEN_COLOR} />
         :   <TextComponent value={'⏳ Pending'} 
             fontSize={28} 
            textAlign='center'
            fontFamily={DMSansMedium} 
            color={theme?.theme.YELLOW_COLOR} />

          }
{itemDetail?.emailStatus== 'pending' &&<Spacer height={30}/>}

{itemDetail?.emailStatus== 'pending' &&
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
        width={deviceWidth/2}
        fontColor={theme?.theme.WHITE_COLOR}
        textStyle={{ fontSize: 16, fontFamily: DMSansSemiBold, letterSpacing: 1.1 }}
        />
}
        </View>

      </KeyboardAwareScrollView>
        </MainContainer2>
    )
}

export default HistoryDetailScreen;