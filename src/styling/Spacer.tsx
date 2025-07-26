import React, {FC} from "react";
import {View} from "react-native";


interface SpacerProps {
    height?: number | string | 0;
    width?: number | string | 0;
    bgColor?: string | 'transparent';
    styles?: [] | object | {};
}

const Spacer: FC<SpacerProps> = (props) => {
    return <View style={[props.styles, { backgroundColor: props.bgColor, width: props.width, height: props.height }]}/>
};

export default Spacer;
