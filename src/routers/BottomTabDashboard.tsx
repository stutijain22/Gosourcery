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

const BottomTab = createBottomTabNavigator();

interface TabIconsProps {
    focused: boolean;
    source: any;
    title: string;
}

const TabIcons: FC<TabIconsProps> = (props) => {
    const { focused, source, title } = props;
    const { theme} = getEssentials();
    return focused ?
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10,
        width: 60, height:60,
         }}>
        <ImageComponent imageType={imageTypes.local} resizeMode={resizeMode.contain} 
        tintColor={theme?.theme?.GREEN_COLOR} source={source}  height={20} width={20}/>
            <Spacer height={5} />
            <TextComponent value={title} fontSize={10} color={theme?.theme?.GREEN_COLOR} 
            fontFamily={DMSansBold}/>
        </View>
        :
        <View style={{ justifyContent: 'center', alignItems: 'center', 
         marginTop:10, width:60, height:60
         }}>
            <ImageComponent imageType={imageTypes.local} 
            resizeMode={resizeMode.contain} 
            tintColor={theme?.theme?.BLACK_COLOR} 
            source={source}  
            height={20} width={20}/>
            <Spacer height={5} />
            <TextComponent value={title} fontSize={10} color={theme?.theme?.BLACK_COLOR} 
            fontFamily={DMSansBold} styles={{ textAlign: 'center' }}/>
        </View>

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
                height: 60 + insets.bottom,
                paddingBottom: insets.bottom,
                paddingTop: 10,
            },
            tabBarHideOnKeyboard:true,
            tabBarActiveTintColor: theme?.theme?.WHITE_COLOR,
            tabBarInactiveTintColor: theme?.theme?.DARK_GREY_COLOR,
            tabBarBackground: () => (
                <View style={{ flex: 1, backgroundColor: theme?.theme?.WHITE_COLOR }}>
                </View>
            ),
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