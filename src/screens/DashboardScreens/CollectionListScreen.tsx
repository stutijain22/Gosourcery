import React, { useEffect, useState } from 'react';
import { MainContainer1, MainContainer2, shadowStyle } from "../../styling/shared";
import { getData, getJSONData, storeJSONData } from '../../utils/AsyncStorage';
import { DMSansBold, DMSansSemiBold, key_selectCollection, key_setCollectionList, key_setLoginToken } from '../../constant/Constant';
import { callGraphQL } from '../../aws/apollo/apolloAPIConnect';
import { GET_LIST_MY_COLLECTIONS, GET_LIST_MY_WORKSPACES } from '../../aws/apollo/queryMutation/apolloQuery';
import HeaderComponent from '../../common/HeaderComponent';
import { getEssentials, goBack, isNetAvailable } from '../../utils/utility';
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
import moment from 'moment';
import SearchInput from '../../common/SearchInput';

const CollectionListScreen = (props:any) => {
    const { navigation, theme } = getEssentials();
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [timeoutToClear, setTimeoutToClear] = useState<any>();
    const [selectedCollection, setSelectedCollection] = useState<any>({});
    const [modalVisible, setModalVisible] = useState({ title: "", key: "", value: false });
    const [collectionList, setCollectionList] = useState<any>([]);
    const { workspaceId } = props?.route?.params;
    const colorPalette = [theme?.theme?.RED_COLOR,theme?.theme.BLUE_COLOR,
      theme?.theme.BLACK_COLOR, theme?.theme.YELLOW_COLOR, theme?.theme.GREEN_COLOR];

    useEffect(() => {
        (async () => {
          let selectCollection:any = await getJSONData(key_selectCollection);          
          let selectCollectionList:any = await getJSONData(key_setCollectionList);          
          await setSelectedCollection(selectCollection);
          const isOnline = await isNetAvailable();
          if(!isOnline){
            await setCollectionList(selectCollectionList)
          }
          setIsLoading(true);
          await fetchWorkspaces();
        })()
        return () => {};
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const loginToken:any = await getData(key_setLoginToken);
           // First call: collectionGroup "workspace"
           console.log("sfbdsnfdsfsasqwqewqwq",{
            limit: 100,
            workspaceId: workspaceId?.id,
            collectionGroup: "workspace",
          });
           
    const res1 = await callGraphQL(GET_LIST_MY_COLLECTIONS, {
      limit: 100,
      workspaceId: workspaceId?.id,
      collectionGroup: "workspace",
    }, loginToken, navigation);

    // Second call: collectionGroup "published"
    const res2 = await callGraphQL(GET_LIST_MY_COLLECTIONS, {
      limit: 100,
      workspaceId: workspaceId?.id,
      collectionGroup: "published",
    }, loginToken, navigation);

    const workspaceCollections = res1?.listMyCollections?.data || [];
    const publishedCollections = res2?.listMyCollections?.data || [];

    const mergedCollections = [...workspaceCollections, ...publishedCollections];     
      await setCollectionList(mergedCollections);

      await storeJSONData(key_setCollectionList,mergedCollections)
            setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          console.error("❌ Failed to fetch workspaces:", err);
        } finally {
          setIsLoading(false);
        }
      };
      

    const handlePress = (item:any) => {
        setSelectedCollection(item);
    }

    const renderItem = ({ item, index }:any) => {
        const {name,createdDate,pictures, creator, lastModified} = item;
        const avatarBgColor = colorPalette[index % colorPalette.length];
        
        return( 
        <TouchableOpacity style={[shadowStyle, selectedCollection?.id === item?.id ? styles.containerStyleSelected
          :styles.containerStyle]}
        activeOpacity={0.8}
        onPress={() => handlePress(item)}>
          {/* <Spacer width={10} /> */}
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
          <View style={{paddingHorizontal:5, flex:1}}>
          <TextComponent
          fontSize={14} 
             fontFamily={DMSansBold} 
            //  textAlign={'center'}
             styles={{ letterSpacing: 1.1,flex:1 }}
            color={theme?.theme.BLACK_COLOR}
            value={name} />

        <TextComponent
          fontSize={10} 
             fontFamily={DMSansBold} 
             styles={{ letterSpacing: 1.1,flex:1 }}
            color={theme?.theme.FORTH_TEXT_COLOR}
            value={'LAST MODIFIED: ' + moment(Number(lastModified)).format('DD MMM, YYYY')} />
         
          </View>
          {selectedCollection?.id === item?.id && (
              <ImageComponent
              source={TICK_ICON}
              width={20}
              height={20}
              imageType={imageTypes.local}
              resizeMode={resizeMode.contain}
            />
            )}
        </TouchableOpacity>
        )
      };

    const nextClick = async () => {
      if(!selectedCollection?.id){
        setModalVisible({ title: "Select Type", key: "Please select a collection", value: true });
      }else{
        await storeJSONData(key_selectCollection,selectedCollection); 
        goBack(navigation)
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
        const filteredWorkspaces = collectionList.filter((item:any) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        );
        await setCollectionList(filteredWorkspaces)
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
          middleText={'Collection Lists'}
          fontSize={18}
          fontColor={theme?.theme?.BLACK_COLOR}
          mainContainer={{backgroundColor:theme?.theme.WHITE_COLOR}}
          isMiddleAvailable={true}
          />
<Spacer height={heightPercentageToDP(3)} />
<SearchInput
        clearSearch={() => clearSearch()}
        search={searchText}
        searchPlaceholder={"Collections"}
        placeholderTextColor={theme?.theme?.DARK_GREY_COLOR}
        handleSearch={debouncedSearch} 
        />
  <Spacer height={heightPercentageToDP(3)} />

          <FlatList
            data={collectionList}
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


        </MainContainer2>
    )
};

export default CollectionListScreen;
