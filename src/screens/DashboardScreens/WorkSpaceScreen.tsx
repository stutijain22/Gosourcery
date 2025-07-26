import React, { useEffect, useState } from 'react';
import { MainContainer1, MainContainer2, shadowStyle } from "../../styling/shared";
import { getData, getJSONData, storeData, storeJSONData } from '../../utils/AsyncStorage';
import { DMSansBold, DMSansSemiBold, key_selectWorkSpace, key_setLoginToken, key_setWorkspaceList } from '../../constant/Constant';
import { callGraphQL } from '../../aws/apollo/apolloAPIConnect';
import { GET_LIST_MY_WORKSPACES } from '../../aws/apollo/queryMutation/apolloQuery';
import HeaderComponent from '../../common/HeaderComponent';
import { getEssentials, goBack, isNetAvailable, navigateScreen } from '../../utils/utility';
import { FlatList, Keyboard, TouchableOpacity, View } from 'react-native';
import Spacer from '../../styling/Spacer';
import styles from './styles';
import TextComponent from '../../common/TextComponent';
import { heightPercentageToDP } from '../../utils/responsiveUI';
import LoaderComponent from '../../common/LoaderComponent';
import { BACK_ARROW_ICON, TICK_ICON } from '../../utils/sharedImages';
import ImageComponent from '../../common/ImageComponent';
import { imageTypes, resizeMode } from '../../utils/enums';
import ButtonComponent from '../../common/ButtonComponent';
import { deviceWidth } from '../../styling/mixin';
import CommonModal from '../../common/CommonModal';
import { S_CollectionListScreen } from '../../constant/screenNameConstants';
import SearchInput from '../../common/SearchInput';

const WorkSpaceScreen = () => {
    const { navigation, theme } = getEssentials();
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedWorkSpace, setSelectedWorkSpace] = useState<any>({});
    const [workSpaceList, setWorkSpaceList] = useState([]);
    const [timeoutToClear, setTimeoutToClear] = useState<any>();
    const colorPalette = [theme?.theme?.RED_COLOR,theme?.theme.BLUE_COLOR,
         theme?.theme.BLACK_COLOR, theme?.theme.YELLOW_COLOR, theme?.theme.GREEN_COLOR];
    const [modalVisible, setModalVisible] = useState({ title: "", key: "", value: false });

    useEffect(() => {
        (async () => {
          let selectWorkSpace:any = await getJSONData(key_selectWorkSpace); 
          let selectWorkSpaceList:any = await getJSONData(key_setWorkspaceList);          
          await setSelectedWorkSpace(selectWorkSpace);
          const isOnline = await isNetAvailable();
          if(!isOnline){
            await setWorkSpaceList(selectWorkSpaceList)
          }

          setIsLoading(true);
          await fetchWorkspaces();
        })()

        return () => {
            console.log('unmont')
            // this now gets called when the component unmounts
        };

    }, []);

    const fetchWorkspaces = async () => {
        try {
            const loginToken:any = await getData(key_setLoginToken);
            const data = await callGraphQL(GET_LIST_MY_WORKSPACES, { limit: 100 }, loginToken,navigation);
            await setWorkSpaceList(data?.listMyWorkspaces?.data);
            await storeJSONData(key_setWorkspaceList,data?.listMyWorkspaces?.data)
            setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          console.error("❌ Failed to fetch workspaces:", err);
        } finally {
          setIsLoading(false);
        }
      };

    const handlePress = (item:any) => {
        setSelectedWorkSpace(item);
    }

    const renderItem = ({ item, index }:any) => {
        const {name} = item;
        const avatarBgColor = colorPalette[index % colorPalette.length];
        return( 
        <TouchableOpacity style={[shadowStyle, selectedWorkSpace?.id === item?.id ? styles.containerStyleSelected
          :styles.containerStyle]}
        activeOpacity={0.8}
        onPress={() => handlePress(item)}>
          <View style={[styles.imageViewStyle,{
            backgroundColor: avatarBgColor,
          }]}>
          <TextComponent
          fontSize={11} 
             fontFamily={DMSansBold} 
             textAlign={'center'}
             styles={{ letterSpacing: 1.1 }}
            color={theme?.theme.WHITE_COLOR}
            value={name?.charAt(0) + name?.charAt(1)} />
          </View>
          <Spacer width={10} />
          <View style={[styles.rowStyle,{flex:1}]}>
          <TextComponent
          fontSize={14} 
             fontFamily={DMSansBold} 
            //  textAlign={'center'}
             styles={{ letterSpacing: 1.1,flex:1 }}
            color={theme?.theme.BLACK_COLOR}
            value={name} />

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
        )
      };

    const nextClick = async () => {
      if(!selectedWorkSpace?.id){
        setModalVisible({ title: "Select Type", key: "Please select a workspace", value: true });
      }else{
        await storeJSONData(key_selectWorkSpace,selectedWorkSpace); 
        goBack(navigation)
        // navigateScreen(navigation, S_CollectionListScreen, { workspaceId: selectedWorkSpace });
      }
    }

    const clearSearch = async () =>{
      setSearchText("");
      Keyboard.dismiss();
      await fetchWorkspaces()
      await setIsLoading(false);
    }
    const handleSearch = async (text: string) => {
      setIsLoading(true)
      if (text.length == 0) {
        clearSearch()
      }
      else if (text.length >= 1) {
        const filteredWorkspaces = workSpaceList.filter((item:any) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        );
        await setWorkSpaceList(filteredWorkspaces)
        await setIsLoading(false)
         
      } else {
        setSearchText(text);
      }
  };

    const debounce = (callback: any, alwaysCall: any, ms: any) => {
      return (...args:any) => {
          alwaysCall(...args);
          clearTimeout(timeoutToClear);
          setTimeoutToClear(
              setTimeout(() => {
                  callback(...args);
              }, ms)
          );
      };
  };

    const setSearchTextAlways = (text:any) => {
      setSearchText(text);
  };

  const debouncedSearch = debounce(
      handleSearch,
      setSearchTextAlways,
      500
  );

    return(
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
          middleText={'Select Workspace'}
          fontSize={18}
          fontColor={theme?.theme?.BLACK_COLOR}
          mainContainer={{backgroundColor:theme?.theme.WHITE_COLOR}}
          isMiddleAvailable={true}
          />
        <Spacer height={heightPercentageToDP(3)} />

        <SearchInput
        clearSearch={() => clearSearch()}
        search={searchText}
        searchPlaceholder={"Workspaces"}
        placeholderTextColor={theme?.theme?.DARK_GREY_COLOR}
        handleSearch={debouncedSearch} 
        />
  <Spacer height={heightPercentageToDP(3)} />
        <FlatList
            data={workSpaceList}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          />
<Spacer height={heightPercentageToDP(2)} />
<ButtonComponent
        title={'NEXT'}
        onHandleClick={() => nextClick()}
        height={50}
        btnBackgroundColor={theme?.theme.BLUE_COLOR}
        width={deviceWidth/ 2}
        fontColor={theme?.theme.WHITE_COLOR}
        textStyle={{ fontSize: 16, fontFamily: DMSansSemiBold, letterSpacing: 1.1 }}
        />

<Spacer height={heightPercentageToDP(3)} />
<CommonModal
            visible={modalVisible.value}
            headingType={modalVisible.title}
            text={modalVisible.key.toString()}
            textFontSize={modalVisible.title == "" ? 20 : 12}
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
            negativeButtonText={'Cancel'}
            negativeButtonTextColor={"#12121795"}
        />

        </MainContainer2>
    )
};

export default WorkSpaceScreen;
