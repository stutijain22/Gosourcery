import { FC } from "react";
import { GestureResponderEvent, TouchableOpacity, StyleSheet, View, ViewStyle, TouchableWithoutFeedback, Modal, Text, Image } from "react-native";
import { getEssentials } from "../utils/utility";
import ImageComponent from "./ImageComponent";
import { resizeMode } from "../utils/enums";
import { imageTypes } from "../utils/enums";
import { CROSS_ICON } from "../utils/sharedImages";
import TextComponent from "./TextComponent";
import { DMSansBold, DMSansRegular, DMSansSemiBold } from "../constant/Constant";
import Spacer from "../styling/Spacer";
import { deviceHeight, deviceWidth } from "../styling/mixin";
import ButtonComponent from "./ButtonComponent";
interface CommonModalProps {
  modalStyle?: ViewStyle;
  visible?: boolean;
  onDismiss?: ((event: GestureResponderEvent) => void) | undefined;
  headingText?: string;
  headingType?: string;
  text?: string;
  text2?: string;
  textColor?: string;
  textFontFamily?: string;
  text2FontSize?: Number;
  textColor2?: string;
  crossIconColor?: string;
  headingTextFontSize?: Number;
  headingTextColor?: string;
  textFontSize?: Number;
  singleButton?: boolean;
  noSingleButton?: boolean;
  positiveButtonText?: string;
  negativeButtonText?: string;
  negativeButtonTextColor?: string;
  buttonHeight?: Number;
  buttonWidth?: Number;
  crossIcon?:boolean;
  buttonBackgroundColor?: string;
  positiveButtonClick?: ((event: GestureResponderEvent) => void) | undefined;
  negativeButtonClick?: ((event: GestureResponderEvent) => void) | undefined;
}

const CommonModal: FC<CommonModalProps> = (props: any) => {
  const _handleDismiss =() => {
    props.onDismiss();
}
const {crossIcon = false} = props;

  return (
    <Modal
    // animated
    // animationType="fade"
    visible={props?.visible}
    transparent
    onRequestClose={() => _handleDismiss()}
    >
    <View style={[styles.overlay, {backgroundColor: '#00000090',} ]}>
      <View
        style={[styles.modalViewStyle, props?.modalStyle]}
      >
        {crossIcon &&
        <TouchableOpacity style={styles.crossViewStyle}
          onPress={props?.onDismiss}
          >
          <ImageComponent resizeMode={resizeMode.cover}
            tintColor={props?.crossIconColor}
            source={CROSS_ICON} styles={{}} height={12} width={12}
            imageType={imageTypes.local} />
        </TouchableOpacity>
}
        {props?.headingText ?
          <View>
            {/* <Spacer height={5} /> */}
            {props?.headingType == "Success" ?
              <TextComponent
                value={props?.headingText}
                fontSize={props?.headingTextFontSize}
                fontFamily={DMSansSemiBold}
                color={"#34BF49"}
                styles={{ textAlign: "center" }}
              /> : props?.headingType == "Error" ?
                <TextComponent
                  value={props?.headingText}
                  fontSize={props?.headingTextFontSize}
                  fontFamily={DMSansSemiBold}
                  color={"#FF464B"}
                  styles={{ textAlign: "center" }}
                /> :
                <TextComponent
                  value={props?.headingText}
                  fontSize={props?.headingTextFontSize}
                  fontFamily={DMSansSemiBold}
                  color={"#34BF49"}
                  styles={{ textAlign: "center" }}
                />}
          </View> :
          <View></View>}
        <Spacer height={10} />


        {/* <TextComponent
          value={props?.text}
          fontSize={props?.textFontSize}
          fontFamily={props?.textFontFamily?props?.textFontFamily: DMSansBold}
          color={props?.textColor}
          styles={{ textAlign: "center" }}
        />

        <TextComponent
          value={props?.text2}
          fontSize={props?.text2FontSize}
          fontFamily={props?.textFontFamily?props?.textFontFamily: DMSansBold}
          color={props?.textColor2}
          textDecorationLine="underline"
          styles={{ textAlign: "center",textDecorationColor: props?.textColor2}}
        /> */}
        {props?.text2 ?
  <Text style={{ textAlign: "center" }}>
  <Text style={{
      fontSize: props?.textFontSize,
      fontFamily: props?.textFontFamily ? props?.textFontFamily : DMSansBold,
      color: props?.textColor
  }}>
    {props?.text + " "}
  </Text>
  <Text style={{
      fontSize: props?.text2FontSize,
      fontFamily: props?.textFontFamily ? props?.textFontFamily : DMSansBold,
      color: props?.textColor2,
      textDecorationLine: "underline",
      textDecorationColor: props?.textColor2
  }}>
    {props?.text2}
  </Text>
</Text>
:
<TextComponent
          value={props?.text}
          fontSize={props?.textFontSize}
          fontFamily={props?.textFontFamily?props?.textFontFamily: DMSansBold}
          color={props?.textColor}
          styles={{ textAlign: "center" }}
        />
}
        <Spacer height={30} />

        {props?.singleButton ?
        props?.noSingleButton?
        null
        :
          <ButtonComponent
            btnBackgroundColor={props?.buttonBackgroundColor}
            textStyle={{
              fontSize: 14,
              fontFamily: DMSansSemiBold,
              letterSpacing: 2,
              alignSelf: "center"
            }}
            height={props?.buttonHeight}
            width={props?.buttonWidth}
            onHandleClick={props?.positiveButtonClick}
            title={props.positiveButtonText}
          />
          :
          <View style={styles.rowStyle}>
            <TouchableOpacity
              onPress={props?.onDismiss}
              style={{ paddingHorizontal: 10 }}>
              <TextComponent
                value={props?.negativeButtonText}
                fontSize={17}
                fontFamily={DMSansRegular}
                color={props?.negativeButtonTextColor}
                textDecorationLine={'underline'}
              // styles={{ marginTop: 15 }}
              />
            </TouchableOpacity>
            <Spacer width={20} />

            <ButtonComponent
              styles={{
                backgroundColor: props?.buttonBackgroundColor
              }}
              textStyle={{
                fontSize: 14,
                fontFamily: DMSansSemiBold,
                letterSpacing: 2,
              }}
              height={props?.buttonHeight}
              width={props?.buttonWidth}
              onHandleClick={props?.positiveButtonClick}
              title={props.positiveButtonText}
            />
          </View>
        }
      </View>
      </View>
      </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    height: deviceHeight,
    width: deviceWidth,
    justifyContent: 'center',
    alignItems: 'center',
},
  modalViewStyle: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: deviceWidth- 40,
    justifyContent: 'center', alignItems: 'center'
  },
  crossViewStyle: {
    position:'absolute',
    right:10,
    top:10,
    height: 25,
    width: 25,
    alignSelf: "flex-end",
    justifyContent: 'center', alignItems: 'center',
  },
  rowStyle: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }
});
export default CommonModal;