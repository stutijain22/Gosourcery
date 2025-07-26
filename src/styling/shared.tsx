import styled from 'styled-components/native';
// import {P_Medium} from "../constants/fontConstants";
import { theme1 } from './themes';
import { deviceHeight, deviceWidth } from './mixin';

export const MainContainer = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: ${theme1.WHITE_COLOR};  
    height: ${deviceHeight}px;
    width: ${deviceWidth}px; `;

export const MainContainer1 = styled.View`
    flex: 1;
    background-color: ${theme1.WHITE_COLOR};  
    height: ${deviceHeight}px;
    width: ${deviceWidth}px; `;

export const MainContainer2 = styled.View`
    flex: 1;
    background-color: ${theme1.LIGHT_GREY_COLOR};  
    height: ${deviceHeight}px;
    width: ${deviceWidth}px; `;

export const MainContainer3 = styled.View`
    flex: 1;
    justifyContent: 'center';
    background-color: ${theme1.LIGHT_GREY_COLOR}; `;

export const splashScreenStyle = {
        width: 200,
        height: 200,
};


export const shadowStyle = {
    // shadowColor: theme1,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
        width: 2,
        height: 10,
    },
    shadowRadius: 5,
    shadowOpacity: 1.25,
    elevation: 1
};