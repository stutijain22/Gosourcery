import React, { FC } from "react";
import { Text } from "react-native";

interface TextComponentProps {
    value: string | number | null;
    styles?: object,
    color?: string,
    fontFamily?: string,
    fontSize?: number,
    textDecorationLine?: string,
    numberOfLines?: number,
    textAlign?: string
}

const TextComponent: FC<TextComponentProps> = (props) => {
    return <Text
        numberOfLines={props.numberOfLines}
        style={[props.styles, {
            color: props.color, fontFamily: props.fontFamily, fontSize: props.fontSize, 
            textDecorationLine: props.textDecorationLine, textAlign: props.textAlign
        }]}>{props.value}</Text>
};

export default TextComponent;
