import React from 'react';
import {MainContainer1} from '../../styling/shared';
import {getEssentials, goBack, navigateScreen} from '../../utils/utility';
import {Camera, CameraType} from 'react-native-camera-kit';
import {deviceHeight, deviceWidth} from '../../styling/mixin';
import {View} from 'react-native';
import HeaderComponent from '../../common/HeaderComponent';
import {BACK_ARROW_ICON} from '../../utils/sharedImages';
import {key_setUserScanData} from '../../constant/Constant';
import {storeData} from '../../utils/AsyncStorage';
import {S_AddNotesScreen} from '../../constant/screenNameConstants';

const QRCodeScreen = () => {
  const {navigation, theme} = getEssentials();

  const handleScan = async (event: any) => {
    const scannedData = event?.nativeEvent?.codeStringValue;

    if (scannedData) {
      const parts = scannedData.split('^');

      if (parts && parts.length > 0) {
        await storeData(key_setUserScanData, scannedData);
        let userData = {
          userEmail: `${parts[11]}`,
          userFirstName: `${parts[1]}`,
          userLastName: `${parts[2]}`,
          userBusinessType: `${parts[3]}`,
          userCompanyName: `${parts[4]}`,
          userAddress: `${parts[5]}`,
          userCity: `${parts[6]}`,
          userState: `${parts[7]}`,
          userZip: `${parts[8]}`,
          userCountry: `${parts[9]}`,
          userPhoneNumber: `${parts[10]}`,
        };
        navigateScreen(navigation, S_AddNotesScreen, {userData});
      }
      // Do something with the scannedData
    } else {
      console.warn('No valid QR code found');
    }
  };

  return (
    <MainContainer1>
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
        fontSize={18}
        middleText={'Scan Badge'}
        fontColor={theme?.theme?.BLACK_COLOR}
        mainContainer={{backgroundColor: theme?.theme.WHITE_COLOR}}
        isMiddleAvailable={true}
      />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Camera
          style={{width: deviceWidth - 44, height: deviceHeight / 2}}
          cameraType={CameraType.Back}
          barcodeFrameSize={{width: deviceWidth - 44, height: deviceHeight / 2}}
          scanBarcode={true}
          onReadCode={event => handleScan(event)} // optional
          showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner, that stops when a code has been found. Frame always at center of the screen
          laserColor="red" // (default red) optional, color of laser in scanner frame
        />
      </View>
    </MainContainer1>
  );
};

export default QRCodeScreen;
