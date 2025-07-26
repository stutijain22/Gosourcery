import React, {FC} from "react";
import {Image} from "react-native";
import {imageTypes, overFlow, resizeMode} from "../utils/enums";
import { setThemeJSON } from "../utils/context";

interface ImageComponentProps {
    source: string | undefined | any;
    styles?: object;
    height: number | string;
    width: number | string;
    tintColor?: string;
    resizeMode?: resizeMode;
    overflow?: overFlow;
    imageType: any;
    imageTypeOne?: any;
}

const ImageComponent: FC<ImageComponentProps> = (props) => {

    const theme = setThemeJSON();

    const {} = props;

    return props.imageType === imageTypes.local ?
        <Image source={props.imageTypeOne ? {uri:props.source} :props.source} 
        style={[ props.styles, { height: props.height, width: props.width, 
            tintColor: props.tintColor && props.tintColor, 
            resizeMode: props.resizeMode, } ] }/>
        :
        <Image source={{uri: props.source }} style={[ props.styles, { height: props.height, width: props.width, resizeMode: props.resizeMode, } ] }/>
};

export default ImageComponent;