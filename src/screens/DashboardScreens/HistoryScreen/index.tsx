import React, {useCallback, useEffect, useState} from 'react';
import HeaderComponent from '../../../common/HeaderComponent';
import {MainContainer2} from '../../../styling/shared';
import {
  getEssentials,
  isNetAvailable,
  navigateScreen,
} from '../../../utils/utility';
import {GET_BADGE_SCANNER_HISTORY} from '../../../aws/apollo/queryMutation/apolloQuery';
import {callGraphQL} from '../../../aws/apollo/apolloAPIConnect';
import {getData, getJSONData, storeJSONData} from '../../../utils/AsyncStorage';
import {
  DMSansBold,
  DMSansMedium,
  key_setHistoryList,
  key_setHistoryPendingList,
  key_setLoginToken,
  key_setUserData,
  key_setUserId,
} from '../../../constant/Constant';
import {
  FlatList,
  Platform,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import Spacer from '../../../styling/Spacer';
import styles from '../styles';
import TextComponent from '../../../common/TextComponent';
import CustomTabView from '../../../common/CustomTabView';
import ImageComponent from '../../../common/ImageComponent';
import {MAIL_ICON} from '../../../utils/sharedImages';
import {imageTypes, resizeMode} from '../../../utils/enums';
import {eventId} from '../../../aws-exports';
import moment from 'moment';
import LoaderComponent from '../../../common/LoaderComponent';
import {S_HistoryDetailScreen} from '../../../constant/screenNameConstants';
import {
  DOWNLOAD_BADGE_SCANNER_HISTORY,
  SEND_BADGE_SCANNER_EMAIL,
} from '../../../aws/apollo/queryMutation/apolloMutation';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {heightPercentageToDP} from '../../../utils/responsiveUI';
import ButtonComponent from '../../../common/ButtonComponent';
import {deviceWidth} from '../../../styling/mixin';
import CommonModal from '../../../common/CommonModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HistoryScreen = () => {
  const isFocused = useIsFocused();
  const {navigation, theme} = getEssentials();
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any>([]);
  const [historyPendingData, setHistoryPendingData] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState('Sent');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState({
    title: '',
    key: '',
    value: false,
  });
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      let historyData: any = await getJSONData(key_setHistoryList);
      let historyPendingData: any = await getJSONData(
        key_setHistoryPendingList,
      );
      const localData: any = await getJSONData(key_setUserData);

      const isOnline = await isNetAvailable();
      if (!isOnline) {
        await setHistoryData(historyData);
        const merged = [...(localData || []), ...(historyPendingData || [])];
        await setHistoryPendingData(merged);
      }
    })();

    return () => {
      console.log('unmont');
      // this now gets called when the component unmounts
    };
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      setSelectedOption('Sent'); // or your default tab
    }, []),
  );

  useEffect(() => {
    (async () => {
      if (selectedOption === 'Sent') {
        setIsLoading(true);
        await fetchHistoryData('sent');
      } else if (selectedOption === 'Pending') {
        setIsLoading(true);
        await fetchHistoryData('pending');
      }
    })();
  }, [selectedOption, isFocused]);

  const _refresh = () => {
    setIsLoading(true);
    fetchHistoryData('pending');
    // Clear the param so it doesn’t re-trigger again
  };

  const tabArrayData = [
    {
      id: 0,
      title: 'Sent',
    },
    {
      id: 1,
      title: 'Pending',
    },
  ];

  const sendPendingItemsToServer = async (merged: any) => {
    const loginToken: any = await getData(key_setLoginToken);
    const userId = await getData(key_setUserId);
    const userData: any[] = (await getJSONData(key_setUserData)) || [];

    const successfullySentKeys = new Set();

    if (!merged || merged.length === 0) return;

    for (const item of merged) {
      try {
        const data = await callGraphQL(
          SEND_BADGE_SCANNER_EMAIL,
          {
            firstName: item.firstName,
            lastName: item.lastName,
            phoneNumber: item.phoneNumber,
            companyName: item.companyName,
            businessType: item.businessType,
            zip: item.zip,
            state: item.state,
            country: item.country,
            city: item.city,
            address: item.address,
            clientEmail: item.clientEmail,
            collectionId: item.collectionId,
            collectionName: item.collectionName,
            eventId: eventId,
            notes: item.notes,
            rawInfo: item.rawInfo || '',
            userId: userId,
            workspaceId: item.workspaceId,
            workspaceName: item.workspaceName,
            resend: true,
          },
          loginToken,
          navigation,
        );
        // Create a key for this item to track
        const key =
          item.transactionId || `${item.clientEmail}_${item.collectionId}`;
        successfullySentKeys.add(key);

        const updatedUserData = userData.filter(item => {
          const key =
            item.transactionId || `${item.clientEmail}_${item.collectionId}`;
          return !successfullySentKeys.has(key);
        });

        const updatedPending = historyPendingData.filter((item: any) => {
          const key =
            item.transactionId || `${item.clientEmail}_${item.collectionId}`;
          return !successfullySentKeys.has(key);
        });

        await storeJSONData(key_setUserData, updatedUserData);
        await storeJSONData(key_setHistoryPendingList, updatedPending);
      } catch (err) {
        console.error('❌ Error sending pending item:', err);
      }
    }
  };

  const fetchHistoryData = async (emailStatus: any) => {
    try {
      const loginToken: any = await getData(key_setLoginToken);
      const userId: any = await getData(key_setUserId);
      const data = await callGraphQL(
        GET_BADGE_SCANNER_HISTORY,
        {
          limit: 200,
          eventId: eventId,
          userId: userId,
          emailStatus: emailStatus,
        },
        loginToken,
        navigation,
      );

      const historyData = data?.getBadgeScannerHistory?.data || [];
      // If emailStatus is 'pending', use local only
      if (emailStatus === 'pending') {
        const localData: any = await getJSONData(key_setUserData);
        const merged = [...(localData || []), ...historyData];
        setHistoryPendingData(merged);
        await storeJSONData(key_setHistoryPendingList, historyData);
        if (
          (historyData && historyData.length > 0) ||
          (localData && localData.length > 0)
        ) {
          await sendPendingItemsToServer(merged);
        }
      } else {
        await storeJSONData(key_setHistoryList, historyData);
        await setHistoryData(historyData);
      }
    } catch (err) {
      setIsLoading(false);
      console.error('❌ Failed to fetch History Data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({item}: any) => {
    return (
      <View style={styles.containerHistoryStyle}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigateScreen(navigation, S_HistoryDetailScreen, {
              itemDetail: item,
              refresh: _refresh,
            })
          }
          style={{flex: 1, padding: 10}}>
          {(item?.firstNam || item?.lastName) && (
            <TextComponent
              value={item?.firstName + ' ' + item?.lastName}
              fontSize={16}
              fontFamily={DMSansBold}
              color={theme?.theme.BLACK_COLOR}
            />
          )}
          <TextComponent
            value={item?.clientEmail}
            fontSize={14}
            fontFamily={DMSansMedium}
            color={theme?.theme.BLACK_COLOR}
          />

          <TextComponent
            value={moment(item?.timestamp).format('DD MMM YYYY, hh:mm A')}
            fontSize={14}
            fontFamily={DMSansMedium}
            color={theme?.theme.DARK_GREY_COLOR}
          />
          {item?.notes && <Spacer height={8} />}
          {item?.notes && (
            <View
              style={[
                styles.notesView,
                {
                  backgroundColor: theme?.theme?.LIGHT_GREY_COLOR,
                },
              ]}>
              <TextComponent
                value={item?.notes && item?.notes}
                fontSize={14}
                fontFamily={DMSansMedium}
                color={theme?.theme.BLACK_COLOR}
              />
            </View>
          )}
        </TouchableOpacity>

        {item?.emailStatus == 'sent' ? (
          <View style={styles.sentViewStyle}>
            <View style={styles.sentIconStyle}>
              <ImageComponent
                source={MAIL_ICON}
                width={17}
                height={17}
                tintColor={theme?.theme.WHITE_COLOR}
                imageType={imageTypes.local}
                resizeMode={resizeMode.contain}
              />
            </View>

            <Spacer height={5} />
            <TextComponent
              value={'Sent'}
              fontSize={12}
              fontFamily={DMSansMedium}
              color={theme?.theme.GREEN_COLOR}
            />
          </View>
        ) : (
          <View style={styles.pendingViewStyle}>
            <View style={styles.pendingIconStyle}>
              <ImageComponent
                source={MAIL_ICON}
                width={17}
                height={17}
                tintColor={theme?.theme.WHITE_COLOR}
                imageType={imageTypes.local}
                resizeMode={resizeMode.contain}
              />
            </View>

            <Spacer height={5} />
            <TextComponent
              value={'Pending'}
              fontSize={12}
              fontFamily={DMSansMedium}
              color={theme?.theme.YELLOW_COLOR}
            />
          </View>
        )}
      </View>
    );
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      // 👇 fetch fresh data here
      const isOnline = await isNetAvailable();
      const localData: any = await getJSONData(key_setUserData);
      let historyPendingData: any = await getJSONData(
        key_setHistoryPendingList,
      );

      if (!isOnline) {
        const merged = [...(localData || []), ...(historyPendingData || [])];
        await setHistoryPendingData(merged);
      } else {
        const newData = await fetchHistoryData('pending');
        setHistoryPendingData(newData);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setRefreshing(false);
    }
  };

  const downloadClick = async () => {
    try {
      setIsLoading(true);
      const loginToken: any = await getData(key_setLoginToken);
      const userId: any = await getData(key_setUserId);
      const data = await callGraphQL(
        DOWNLOAD_BADGE_SCANNER_HISTORY,
        {
          eventId: eventId,
          userId: userId,
        },
        loginToken,
        navigation,
      );

      const downloadData = data?.downloadBadgeScannerHistory;
      setModalVisible({
        title: 'Email Sent',
        key: 'Leads information has been sent to your inbox.',
        value: true,
      });
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      console.error('❌ Failed to fetch Download Data:', err);
      setModalVisible({title: 'Error', key: err?.message, value: true});
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClick = () => {
    if (modalVisible.title == 'Success') {
      setModalVisible({title: '', key: '', value: false});
    } else {
      setModalVisible({title: '', key: '', value: false});
    }
  };

  return (
    <MainContainer2>
      <LoaderComponent isLoading={isLoading} loadingMessage={'Loading ... '} />
      <HeaderComponent
        height={50}
        middleText={'Leads'}
        fontSize={18}
        fontColor={theme?.theme?.BLACK_COLOR}
        mainContainer={{backgroundColor: theme?.theme.WHITE_COLOR}}
        isMiddleAvailable={true}
      />
      <Spacer height={20} />

      <CustomTabView
        containerStyle={styles.tabViewContainerStyle}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        optionArray={tabArrayData}
      />
      <Spacer height={20} />

      {selectedOption == 'Sent' ? (
        historyData && historyData.length > 0 ? (
          <FlatList
            data={historyData}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 80, // space for footer
            }}
          />
        ) : (
          <View style={[styles.columnStyle, {flex: 1}]}>
            <TextComponent
              value={'No data has been sent yet'}
              fontSize={19}
              fontFamily={DMSansBold}
              color={theme?.theme?.TEXT_COLOR}
              // styles={styles.textViewStyle}
            />
          </View>
        )
      ) : historyPendingData && historyPendingData.length > 0 ? (
        <FlatList
          data={historyPendingData}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 80, // space for footer
          }}
        />
      ) : (
        <View style={[styles.columnStyle, {flex: 1}]}>
          <TextComponent
            value={'No pending messages to be sent'}
            fontSize={19}
            fontFamily={DMSansBold}
            color={theme?.theme?.TEXT_COLOR}
          />
        </View>
      )}

      <Spacer height={heightPercentageToDP(1.5)} />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme?.theme?.WHITE_COLOR, // full-width footer background
          paddingBottom:
            Platform.OS == 'ios' ? insets.bottom - 20 : insets.bottom - 10, // safe area for iOS/Android
          paddingTop: 10,
          alignItems: 'center',
        }}>
        <ButtonComponent
          title={'DOWNLOAD LEADS'}
          onHandleClick={() => downloadClick()}
          height={50}
          tintColor={theme?.theme.WHITE_COLOR}
          btnBackgroundColor={theme?.theme.BLUE_COLOR}
          width={deviceWidth - 80}
          fontColor={theme?.theme.WHITE_COLOR}
          textStyle={{letterSpacing: 1.1}}
        />
      </View>

      <CommonModal
        visible={modalVisible.value}
        headingType={modalVisible.title}
        text={modalVisible.key.toString()}
        textFontSize={modalVisible.title == '' ? 20 : 14}
        textColor={theme?.theme?.BLACK_COLOR}
        onDismiss={() => setModalVisible({title: '', key: '', value: false})}
        buttonHeight={50}
        buttonWidth={120}
        crossIcon={true}
        headingText={modalVisible.title}
        headingTextFontSize={20}
        buttonBackgroundColor={theme?.theme.BLUE_COLOR}
        singleButton={true}
        positiveButtonClick={() => buttonClick()}
        positiveButtonText={'OK'}
      />
    </MainContainer2>
  );
};

export default HistoryScreen;
