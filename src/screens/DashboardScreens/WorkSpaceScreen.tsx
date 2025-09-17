import React, {useEffect, useState} from 'react';
import {MainContainer2, shadowStyle} from '../../styling/shared';
import {getData, getJSONData, storeJSONData} from '../../utils/AsyncStorage';
import {
  DMSansBold,
  DMSansSemiBold,
  key_selectCollection,
  key_selectWorkSpace,
  key_setLoginToken,
  key_setWorkspaceList,
} from '../../constant/Constant';
import {callGraphQL} from '../../aws/apollo/apolloAPIConnect';
import {GET_LIST_MY_WORKSPACES} from '../../aws/apollo/queryMutation/apolloQuery';
import HeaderComponent from '../../common/HeaderComponent';
import {getEssentials, goBack, isNetAvailable} from '../../utils/utility';
import {
  FlatList,
  Keyboard,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import Spacer from '../../styling/Spacer';
import styles from './styles';
import TextComponent from '../../common/TextComponent';
import {heightPercentageToDP} from '../../utils/responsiveUI';
import LoaderComponent from '../../common/LoaderComponent';
import {BACK_ARROW_ICON, TICK_ICON} from '../../utils/sharedImages';
import ImageComponent from '../../common/ImageComponent';
import {imageTypes, resizeMode} from '../../utils/enums';
import ButtonComponent from '../../common/ButtonComponent';
import {deviceWidth} from '../../styling/mixin';
import CommonModal from '../../common/CommonModal';
import SearchInput from '../../common/SearchInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const WorkSpaceScreen = () => {
  const {navigation, theme} = getEssentials();
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedWorkSpace, setSelectedWorkSpace] = useState<any>({});
  const [workSpaceList, setWorkSpaceList] = useState([]);
  const [allWorkspaces, setAllWorkspaces] = useState([]);
  const [timeoutToClear, setTimeoutToClear] = useState<any>();
  const colorPalette = [
    theme?.theme?.RED_COLOR,
    theme?.theme.BLUE_COLOR,
    theme?.theme.BLACK_COLOR,
    theme?.theme.YELLOW_COLOR,
    theme?.theme.GREEN_COLOR,
  ];
  const [modalVisible, setModalVisible] = useState({
    title: '',
    key: '',
    value: false,
  });
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      let selectWorkSpace: any = await getJSONData(key_selectWorkSpace);
      let selectWorkSpaceList: any = await getJSONData(key_setWorkspaceList);
      await setSelectedWorkSpace(selectWorkSpace);
      const isOnline = await isNetAvailable();
      if (!isOnline) {
        await setWorkSpaceList(selectWorkSpaceList);
      }

      setIsLoading(true);
      await fetchWorkspaces();
    })();

    return () => {
      console.log('unmont');
    };
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const loginToken: any = await getData(key_setLoginToken);
      const data = await callGraphQL(
        GET_LIST_MY_WORKSPACES,
        {limit: 100},
        loginToken,
        navigation,
      );

      // sort alphabetically by name (case-insensitive)
      const sortedWorkspaces: any = [
        ...(data?.listMyWorkspaces?.data || []),
      ].sort((a: any, b: any) =>
        a.name.localeCompare(b.name, 'en', {sensitivity: 'base'}),
      );

      await setWorkSpaceList(sortedWorkspaces);
      await setAllWorkspaces(sortedWorkspaces);
      await storeJSONData(key_setWorkspaceList, sortedWorkspaces);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error('❌ Failed to fetch workspaces:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePress = async (item: any) => {
    try {
      let selectCollection: any = await getJSONData(key_selectCollection);
      if (selectCollection) {
        setSelectedWorkSpace(item);
        await storeJSONData(key_selectCollection, {});
      } else {
        setSelectedWorkSpace(item);
      }
    } catch (error) {
      console.log('Error in handlePress:', error);
    }
  };

  const renderItem = ({item, index}: any) => {
    const {name} = item;
    const avatarBgColor = colorPalette[index % colorPalette.length];
    return (
      <TouchableOpacity
        style={[
          shadowStyle,
          selectedWorkSpace?.id === item?.id
            ? styles.containerStyleSelected
            : styles.containerStyle,
        ]}
        activeOpacity={0.8}
        onPress={() => handlePress(item)}>
        <View
          style={[
            styles.imageViewStyle,
            {
              backgroundColor: avatarBgColor,
            },
          ]}>
          <TextComponent
            fontSize={11}
            fontFamily={DMSansBold}
            textAlign={'center'}
            styles={{letterSpacing: 1.1}}
            color={theme?.theme.WHITE_COLOR}
            value={
              name?.charAt(0).toUpperCase() + name?.charAt(1).toUpperCase()
            }
          />
        </View>
        <Spacer width={10} />
        <View style={[styles.rowStyle, {flex: 1}]}>
          <TextComponent
            fontSize={14}
            fontFamily={DMSansBold}
            styles={{letterSpacing: 1.1, flex: 1}}
            color={theme?.theme.BLACK_COLOR}
            value={name}
          />

          {selectedWorkSpace?.id === item?.id && (
            <ImageComponent
              source={TICK_ICON}
              width={20}
              height={20}
              imageType={imageTypes.local}
              resizeMode={resizeMode.contain}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const nextClick = async () => {
    if (!selectedWorkSpace?.id) {
      setModalVisible({
        title: 'Select Type',
        key: 'Please select a workspace',
        value: true,
      });
    } else {
      await storeJSONData(key_selectWorkSpace, selectedWorkSpace);
      goBack(navigation);
    }
  };

  const clearSearch = async () => {
    setSearchText('');
    Keyboard.dismiss();
    setWorkSpaceList(allWorkspaces); // reset from master list
    await setIsLoading(false);
  };

  const handleSearch = async (text: string) => {
    setIsLoading(true);
    if (!text) {
      await setWorkSpaceList(allWorkspaces);
      await setIsLoading(false);
      return;
    }
    const filteredWorkspaces = allWorkspaces.filter((item: any) =>
      item?.name?.toLowerCase().includes(text.toLowerCase()),
    );
    await setWorkSpaceList(filteredWorkspaces);
    await setIsLoading(false);
  };

  const debounce = (callback: any, alwaysCall: any, ms: any) => {
    return (...args: any) => {
      alwaysCall(...args);
      clearTimeout(timeoutToClear);
      setTimeoutToClear(
        setTimeout(() => {
          callback(...args);
        }, ms),
      );
    };
  };

  const setSearchTextAlways = (text: any) => {
    setSearchText(text);
  };

  const debouncedSearch = debounce(handleSearch, setSearchTextAlways, 500);

  return (
    <MainContainer2>
      <LoaderComponent isLoading={isLoading} loadingMessage={'Loading ... '} />
      <HeaderComponent
        isLeftAvailable={true}
        leftIcon={BACK_ARROW_ICON}
        leftIconStyle={{
          width: 20,
          height: 20,
          tintColor: theme?.theme.BLACK_COLOR,
        }}
        onLeftPress={() => goBack(navigation)}
        height={50}
        middleText={'Select Workspace'}
        fontSize={18}
        fontColor={theme?.theme?.BLACK_COLOR}
        mainContainer={{backgroundColor: theme?.theme.WHITE_COLOR}}
        isMiddleAvailable={true}
      />
      <Spacer height={heightPercentageToDP(3)} />

      <SearchInput
        clearSearch={() => clearSearch()}
        search={searchText}
        searchPlaceholder={'Workspaces'}
        placeholderTextColor={theme?.theme?.DARK_GREY_COLOR}
        handleSearch={debouncedSearch}
      />
      <Spacer height={heightPercentageToDP(3)} />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'android' ? 100 : 20} // push content up
        keyboardOpeningTime={0}
        enableAutomaticScroll={true} // ✅ allow automatic scroll
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 80, // leave space for footer
        }}>
        {workSpaceList && workSpaceList.length > 0 ? (
          <FlatList
            data={workSpaceList}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={[styles.columnStyle, {flex: 1}]}>
            <TextComponent
              value={'No workspaces'}
              fontSize={19}
              fontFamily={DMSansBold}
              color={theme?.theme?.TEXT_COLOR}
              // styles={styles.textViewStyle}
            />
          </View>
        )}
        <Spacer height={heightPercentageToDP(2)} />
      </KeyboardAwareScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme?.theme?.WHITE_COLOR, // full-width footer background
          paddingBottom: insets.bottom + 10, // safe area for iOS/Android
          paddingTop: 10,
          alignItems: 'center',
        }}>
        <ButtonComponent
          title={'NEXT'}
          onHandleClick={() => nextClick()}
          height={50}
          btnBackgroundColor={theme?.theme.BLUE_COLOR}
          width={deviceWidth / 2}
          fontColor={theme?.theme.WHITE_COLOR}
          textStyle={{
            fontSize: 16,
            fontFamily: DMSansSemiBold,
            letterSpacing: 1.1,
          }}
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
        crossIconColor={theme?.theme?.DARK_GREY_COLOR}
        headingText={modalVisible.title}
        headingTextFontSize={20}
        singleButton={true}
        positiveButtonClick={() =>
          setModalVisible({title: '', key: '', value: false})
        }
        positiveButtonText={'OK'}
        negativeButtonText={'Cancel'}
        negativeButtonTextColor={'#12121795'}
      />
    </MainContainer2>
  );
};

export default WorkSpaceScreen;
