import React, { FC, useState } from 'react';
import TextComponent from './TextComponent';
import { ActivityIndicator, View } from 'react-native';
import Spacer from '../styling/Spacer';
import { deviceHeight, deviceWidth } from '../styling/mixin';
import { DMSansBold } from '../constant/Constant';

interface LOADER_PROPS {
    isLoading?: boolean;
    loadingMessage?: string | '';
    loaderStyle?: any;
}

const LoaderComponent: FC<LOADER_PROPS> = (props) => {

    return props.isLoading ? (
        <View style={[props.loaderStyle ?props.loaderStyle: { height: deviceHeight, justifyContent: "center",
         alignItems: 'center', width: deviceWidth, zIndex: 999, 
         position: 'absolute', backgroundColor: '#00000090' }]}>
            <ActivityIndicator
                size={'small'}
                color={"#ffffff"} />
            <Spacer height={20} />
            <TextComponent value={props?.loadingMessage}
                color={'#ffffff'} fontSize={12}
                fontFamily={DMSansBold} />
        </View>
    ) : <></>
}

export default LoaderComponent;