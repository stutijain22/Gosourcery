import { FC, ReactNode } from "react";
import { setThemeJSON } from "../utils/context";
import { DMSansBold, DMSansRegular } from "../constant/Constant";
import { Image, StatusBar, TextProps, TouchableOpacity, View } from "react-native";
import { deviceWidth } from "../styling/mixin";
import { isTablet } from "react-native-device-info";
import TextComponent from "./TextComponent";
import OfflineNotice from "./OfflineNotice";
import { useSafeAreaInsets } from "react-native-safe-area-context";


interface HeaderProps {
  height?: number | string | any;
  headerBGColor?: string | null;
  midText?: string;
  leftIcon?: React.ReactNode | any;
  onLeftPress?: () => void;
  isLeftAvailable?: boolean | true;
  isMiddleAvailable?: boolean | true;
  leftStyle?: [] | object | {};
  leftIconStyle?: [] | object | {};

  rightIcon?: React.ReactNode | any;
  searchIcon?: React.ReactNode | any;
  rightText?: string | any;
  onRightPress?: () => void;
  onSearchPress?: () => void;
  isRightAvailable?: boolean | false;
  isSearchAvailable?: boolean | false;
  isRightMenuAvailable?: boolean | false;
  firstOptionOnSelect?: () => void;
  secondOptionOnSelect?: () => void;
  rightStyle?: [] | object | {};
  rightTextStyle?: [] | object | {} | any;
  rightIconStyle?: [] | object | {};

  middleText?: string | any | "";
  hasSubText?: boolean;
  middleSubTextWithIcon?: React.ReactNode | any;
  middleStyle?: [] | object | {};
  middleTextStyle?: [] | object | {};
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  numberOfLines?: number;
  showBorder?: boolean | false;
  mainContainer?: [] | object | {};

  isChildAvailable?: boolean | false;
  children?: ReactNode | any;

  headerGradientHeight?: number | string | any;

  props?: TextProps & TextProps;
}

const bottom_border = {
  borderBottomWidth: 1,
  borderBottomColor: "#00000020",
};
const HeaderComponent: FC<HeaderProps> = (props) => {
  const theme = setThemeJSON();
  const insets = useSafeAreaInsets(); // gives top, bottom, left, right padding
  const baseHeight = 50;
  const {
    leftIcon,
    leftIconStyle = { height: 25, width: 25, },
    leftStyle = { height: 35, width: 35, marginLeft: 10 },
    isSearchAvailable,
    onSearchPress,
    middleText,
    onLeftPress,
    onRightPress,
    rightIcon,
    rightText,
    isRightAvailable,
    searchIcon,
    isLeftAvailable,
    isMiddleAvailable,
    rightStyle,
    rightTextStyle,
    rightIconStyle = { height: 25, width: 25 },
    middleTextStyle,
    showBorder,
    mainContainer,
    isChildAvailable,
    children,
    fontSize = 24,
    fontColor = theme?.theme?.WHITE_COLOR,
    fontFamily = DMSansBold,
    hasSubText = false,
    middleSubTextWithIcon,
  } = props;

  return (
    <View>
       <StatusBar backgroundColor={theme?.theme.WHITE_COLOR} barStyle="dark-content" />
    <View
      style={[
        showBorder && bottom_border,
        {
          backgroundColor: "transparent",
          width: deviceWidth,
          height: baseHeight + insets.top,
          justifyContent: "flex-end",
          alignItems: "flex-end",
          alignSelf:'center',
          paddingBottom: 2,
        },
        mainContainer,
      ]}
    >
      
        <View
          style={[
            {
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          {/** @left icon */}
          {isLeftAvailable &&(
          <TouchableOpacity activeOpacity={0.8} onPress={onLeftPress}>
            <View
              style={[
                leftStyle,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Image source={leftIcon} style={[leftIconStyle]} />
            </View>
          </TouchableOpacity>
)}

          {/** @middle text */}
          {isMiddleAvailable&&
          <View
            style={{
              padding: 10,
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <TextComponent
              {...props.props}
              styles={middleTextStyle}
              value={middleText.toUpperCase()}
              // numberOfLines={numberOfLines}
              fontSize={isTablet() ? 18 : fontSize}
              color={fontColor}
              fontFamily={fontFamily}
            />
            {hasSubText && middleSubTextWithIcon}
          </View>
}
          {/** @right icon or text */}
          {isSearchAvailable && (
            <TouchableOpacity activeOpacity={0.8} onPress={onSearchPress}>
              <View
                style={[
                  rightStyle,
                  !isRightAvailable ? {marginEnd:10}:{},
                  { justifyContent: "center", alignItems: "center"},
                ]}
              >
                  <Image source={searchIcon} style={[rightIconStyle]} />
              </View>
            </TouchableOpacity>
          )}

          {isRightAvailable && (
            <TouchableOpacity activeOpacity={0.8} onPress={onRightPress}>
              <View
                style={[
                  rightStyle,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                {rightText ? (
                  <TextComponent
                    value={rightText}
                    styles={rightTextStyle}
                    color={rightTextStyle?.color}
                    fontFamily={rightTextStyle?.fontFamily || DMSansRegular}
                    fontSize={rightTextStyle?.fontSize || 12}
                  />
                ) : (
                  <Image source={rightIcon} style={[rightIconStyle]} />
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      {isChildAvailable && children}
    </View>
    <OfflineNotice/>

    </View>

  );
};

export default HeaderComponent;
