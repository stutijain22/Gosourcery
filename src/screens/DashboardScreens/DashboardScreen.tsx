import React, { useEffect, useRef, useState } from 'react';
import { MainContainer2 } from '../../styling/shared';
import { getEssentials, navigateScreen } from '../../utils/utility';
import { deviceWidth } from '../../styling/mixin';
import { View } from 'react-native';
import HeaderComponent from '../../common/HeaderComponent';
import { BARCODE_SCANNER_ICON, PENCIL_ICON, RIGHT_ARROW_ICON  } from '../../utils/sharedImages';
import TextComponent from '../../common/TextComponent';
import { DMSansBold, key_selectCollection, key_selectWorkSpace } from '../../constant/Constant';
import Spacer from '../../styling/Spacer';
import ButtonComponent from '../../common/ButtonComponent';
import { heightPercentageToDP } from '../../utils/responsiveUI';
import {getJSONData} from '../../utils/AsyncStorage';
import { S_AddNotesScreen, S_CollectionListScreen, S_QRCodeScreen, S_WorkSpaceScreen } from '../../constant/screenNameConstants';
import { useIsFocused } from '@react-navigation/native';
import CommonModal from '../../common/CommonModal';
import OfflineNotice from '../../common/OfflineNotice';

const DashboardScreen = () => {
    const isFocused = useIsFocused()
    const qrScannerRef: any = useRef(null);
    const [selectedWorkSpace, setSelectedWorkSpace] = useState<any>({});
    const [selectedCollection, setSelectedCollection] = useState<any>({});
    const [userEmail, setUserEmail] = useState('');
    const [modalVisible, setModalVisible] = useState({ title: "", key: "", value: false });
    const { navigation, theme } = getEssentials();

    useEffect(() => {
      (async () => {
        let selectWorkSpace:any = await getJSONData(key_selectWorkSpace);
        let selectCollection:any = await getJSONData(key_selectCollection);
        await setSelectedWorkSpace(selectWorkSpace);
        await setSelectedCollection(selectCollection);
        // await setIsCameraOpen(false);
      })();
    }, [isFocused]);

    const openCamera = () => {
        navigateScreen(navigation,S_QRCodeScreen)
    };

    const clickCollection = () =>{
        navigateScreen(navigation,S_CollectionListScreen, { workspaceId: selectedWorkSpace })
    }

    const clickWorkspace = () =>{
        navigateScreen(navigation,S_WorkSpaceScreen)
    }
    const clickEnterManually = () =>{
        navigateScreen(navigation,S_AddNotesScreen,{keyData:"enterManual"})
    }

    return (
        <MainContainer2>
          <HeaderComponent
          // isLeftAvailable={true}
          // leftIcon={BACK_ARROW_ICON}
          // onLeftPress={() => goBack(navigation)}
          height={50}
          middleText={'Dashboard'}
          fontSize={18}
          fontColor={theme?.theme?.BLACK_COLOR}
          mainContainer={{backgroundColor:theme?.theme.WHITE_COLOR}}
          isMiddleAvailable={true}
          />
         <View style={{flex:1, paddingHorizontal:30}}>
    
         <Spacer height={heightPercentageToDP(6)} />

           
            <TextComponent value={'Select Workspace'} 
            fontSize={18} 
            fontFamily={DMSansBold} 
            color={theme?.theme.BLACK_COLOR} />
         <Spacer height={10} />

<ButtonComponent
                    title={selectedWorkSpace?.id ? selectedWorkSpace?.name?.toUpperCase(): 'SELECT WORKSPACE'}
                    onHandleClick={() => clickWorkspace()}
                    height={55}
                    tintColor={theme?.theme.BLACK_COLOR}
                    iconHeight={25}
                    iconWidth={25}
                    isRigthIconAvailable={true}
                    rightIcon={RIGHT_ARROW_ICON}
                    btnBackgroundColor={theme?.theme.WHITE_COLOR}
                    borderBackgroundColor={theme?.theme.BLACK_COLOR}
                    width={deviceWidth - 50}
                    fontColor={theme?.theme.BLACK_COLOR}
                    // textStyle={{ letterSpacing: 1.1, }}
                    />
          <Spacer height={heightPercentageToDP(4)} />

           
        <TextComponent value={'Select Collection'} 
        fontSize={18} 
        fontFamily={DMSansBold} 
        color={theme?.theme.BLACK_COLOR} />
        <Spacer height={10} />

        <ButtonComponent
            title={selectedCollection?.id ? selectedCollection?.name?.toUpperCase(): 'SELECT COLLECTION'}
            onHandleClick={() => clickCollection()}
            height={55}
            tintColor={theme?.theme.BLACK_COLOR}
            iconHeight={25}
            iconWidth={25}
            isDisabled={selectedWorkSpace?.id ? false: true}
            isRigthIconAvailable={true}
            rightIcon={RIGHT_ARROW_ICON}
            btnBackgroundColor={theme?.theme.WHITE_COLOR}
            borderBackgroundColor={theme?.theme.BLACK_COLOR}
            width={deviceWidth - 50}
            fontColor={theme?.theme.BLACK_COLOR}
            // textStyle={{ letterSpacing: 1.1 }}
            />

            <Spacer height={heightPercentageToDP(9)} />
            <ButtonComponent
                    title={'SCAN BADGE'}
                    onHandleClick={() => openCamera()}
                    height={50}
                    tintColor={selectedWorkSpace?.id && selectedCollection?.id? theme?.theme?.WHITE_COLOR :theme?.theme.BLACK_COLOR}
                    iconHeight={20}
                    iconWidth={20}
                    isDisabled={selectedWorkSpace?.id && selectedCollection?.id?  false: true}
                    isIconAvailable={true}
                    leftIcon={BARCODE_SCANNER_ICON}
                    btnBackgroundColor={theme?.theme.BLUE_COLOR}
                    width={deviceWidth - 50}
                    fontColor={selectedWorkSpace?.id && selectedCollection?.id? theme?.theme?.WHITE_COLOR :theme?.theme.BLACK_COLOR}
                    textStyle={{letterSpacing: 1.1}}
                    />
            <Spacer height={heightPercentageToDP(4)} />

            <ButtonComponent
                    title={'ENTER MANUALLY'}
                    tintColor={theme?.theme.BLACK_COLOR}
                    onHandleClick={() => clickEnterManually()}
                    height={50}
                    iconHeight={20}
                    iconWidth={20}
                    isDisabled={selectedWorkSpace?.id && selectedCollection?.id? false: true}
                    isIconAvailable={true}
                    leftIcon={PENCIL_ICON}
                    btnBackgroundColor={theme?.theme.WHITE_COLOR}
                    borderBackgroundColor={theme?.theme.BLACK_COLOR}
                    width={deviceWidth - 50}
                    fontColor={theme?.theme.BLACK_COLOR}
                    textStyle={{ letterSpacing: 1.1 }}
                    />
          </View>

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
            negativeButtonText={'Cancel'}
            negativeButtonTextColor={"#12121795"}
        />
        </MainContainer2>
    );
};

export default DashboardScreen;