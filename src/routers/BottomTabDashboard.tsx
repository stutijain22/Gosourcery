import React, {FC, useEffect, useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View } from 'react-native';
import { getEssentials } from '../utils/utility';
import { S_AddNotesScreen, S_DashboardScreen, S_HistoryScreen, S_MyAccountScreen, S_QRCodeScreen } from '../constant/screenNameConstants';
import QRCodeScreen from '../screens/DashboardScreens/QRCodeScreen';
import { imageTypes, resizeMode } from '../utils/enums';
import ImageComponent from '../common/ImageComponent';
import Spacer from '../styling/Spacer';
import TextComponent from '../common/TextComponent';
import { DMSansBold, DMSansMedium } from '../constant/Constant';
import { BARCODE_SCANNER_ICON, HISTORY_ICON, USER_ICON } from '../utils/sharedImages';
import HistoryScreen from '../screens/DashboardScreens/HistoryScreen/index';
import DashboardScreen from '../screens/DashboardScreens/DashboardScreen';
import MyAccountScreen from '../screens/DashboardScreens/MyAccountScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deviceWidth } from '../styling/mixin';

const BottomTab = createBottomTabNavigator();

interface TabIconsProps {
    focused: boolean;
    source: any;
    title: string;
}

const TabIcons: FC<TabIconsProps> = ({ focused, source, title }) => {
    const { theme } = getEssentials();
  
    return (
      <View
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          width: deviceWidth/5,
          height: 60,
          marginTop:10,
          paddingBottom: 4, // keeps it from floating on iOS
        }}
      >
        <ImageComponent
          imageType={imageTypes.local}
          resizeMode={resizeMode.contain}
          source={source}
          tintColor={focused ? theme?.theme?.GREEN_COLOR : theme?.theme?.BLACK_COLOR}
          height={20}
          width={20}
        />
        <Spacer height={3} />
        <TextComponent
          value={title}
          fontSize={11}
          color={focused ? theme?.theme?.GREEN_COLOR : theme?.theme?.BLACK_COLOR}
          fontFamily={DMSansBold}
          styles={{ textAlign: "center" }}
        />
      </View>
    );
  };
  

export const BottomTabDashboard: FC = () => {
    const { theme } = getEssentials();
    const insets = useSafeAreaInsets();
    return (
        <BottomTab.Navigator
        initialRouteName={S_DashboardScreen}
        screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
                height: 70 + insets.bottom, // stable bar height
                paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
                paddingTop: 5,
                backgroundColor: theme?.theme?.WHITE_COLOR,
                borderTopWidth: 0.5,
                borderTopColor: "#ccc",
              },
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: theme?.theme?.GREEN_COLOR,
            tabBarInactiveTintColor: theme?.theme?.BLACK_COLOR,
          }}>
                 <BottomTab.Screen 
                    name={S_DashboardScreen} component={DashboardScreen}
                              options={{
                                 tabBarIcon: ({ focused }) => <TabIcons title={'Scan Badge'} 
                                  focused={focused} source={BARCODE_SCANNER_ICON} />,
                                  tabBarLabelStyle: { display: "none" },
                                  headerShown: false,
                                  
                              }} />
                                    <BottomTab.Screen 
                    name={S_HistoryScreen} component={HistoryScreen}
                              options={{
                                  tabBarIcon: ({ focused }) => <TabIcons title={'Leads'} 
                                  focused={focused} source={HISTORY_ICON} />,
                                  tabBarLabelStyle: { display: "none" },
                                  headerShown: false
                              }} />
                               <BottomTab.Screen 
                    name={S_MyAccountScreen} component={MyAccountScreen}
                              options={{
                                  tabBarIcon: ({ focused }) => <TabIcons title={'Account'} 
                                  focused={focused} source={USER_ICON} />,
                                  tabBarLabelStyle: { display: "none" },
                                  headerShown: false
                              }} />
        </BottomTab.Navigator>
    );
};