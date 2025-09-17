import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Platform, StyleSheet, Text, View} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { DMSansMedium } from '../constant/Constant';
import { getEssentials } from '../utils/utility';

const { width } = Dimensions.get('window');

const MiniOfflineSign = ({ color, message}: any) => {

    return (
        <View style={[styles.offlineContainer, { backgroundColor: color } ]}>
            <Text style={styles.offlineText}>{message}</Text>
        </View>
    );
};

const OfflineNotice = (props: any) => {

    const {theme} = getEssentials();
    const timeoutRef = useRef<any>(null);
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');

    const handleConnectivityChange = (state: any) => {
        if (!state.isConnected) {
          setMessage('Please check your network connection.');
          setVisible(true);
          resetTimeout();
        } else if (!state.isInternetReachable) {
          setMessage('Slow internet connection.');
          setVisible(true);
          resetTimeout();
        }else{
          // setMessage('');
          setVisible(false);
        }
      };
    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setVisible(false), 5000);
      };


    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
        return () => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          unsubscribe();
        };
      }, []);
    return visible ? <MiniOfflineSign color={theme?.theme.RED_COLOR} message={message} /> : null;


};

const styles = StyleSheet.create({
    offlineContainer: {
        height: Platform.OS === 'android' ? 50 : 50,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: width,
        paddingBottom: 15,
    },
    offlineText: { fontFamily: DMSansMedium, color: '#ffffff', fontSize: 14 }
});

export default OfflineNotice;