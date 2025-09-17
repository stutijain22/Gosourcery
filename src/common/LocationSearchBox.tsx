import React, { FC, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TextComponent from './TextComponent';
import { getEssentials } from '../utils/utility';
import { DMSansBold } from '../constant/Constant';
import Spacer from '../styling/Spacer';
import { YOUR_GOOGLE_API_KEY } from '../aws-exports';

interface TextInputComponentProps {
  refInner?: any;
  numberOfLines?: any;
  editable?: boolean;
  multiline?: boolean;
  onChangeText?: any;
  value?: string | any;
  placeholder: string;
  placeholderTextColor?: string;
  styles?: object,
  onFocusChanged?: (isFocused: boolean) => void,
  getKeyboardHeight?: (btnLocation: number) => void,
  onChange?: any;
  showValidationError?: boolean;
  showValidationErrorStyle?: {} | [];
  showValidationErrorMessage?: string;
  color?: string,
  fontFamily?: string,
  fontSize?: number,
  //onChangeText?: () => void;
  // wrapper props
  isFocused?: boolean | false,
  maxLength?: any,
  tintColor?: any;
  onBlur?: any,
  disabled?: boolean;
  onPlaceSelected?:any;
  wrapperWidth?: number | 0,
  wrapperHeight?: number | 0,
  textWrapperStyle?: object,
}

const LocationSearchBox : FC<TextInputComponentProps> = (props) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { theme } = getEssentials();

  const fetchAutocomplete = async (input: string) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${YOUR_GOOGLE_API_KEY}&language=en`
      );
      const json = await response.json();

      if (json.status === 'OK') {
        setSuggestions(json.predictions);
      } else {
        console.warn('Places API Error:', json.status);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  const handleSelect = async (placeId: string, description: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${YOUR_GOOGLE_API_KEY}`
      );
      const json = await response.json();

      if (json.status === 'OK') {
        const location = json.result.geometry.location;
        props.onPlaceSelected?.({
          address: description,
          latitude: location.lat,
          longitude: location.lng,
        });
        setQuery(description);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Details Fetch Error:', error);
    }
  };

  return (
    <View>
                        <TextComponent
                        fontFamily={DMSansBold} 
                        fontSize={16}
                        color={theme?.theme?.BLACK_COLOR} 
                        value={'Location'} 
                        />
                                <Spacer height={10} />
      <TextInput
        placeholder={props.placeholder}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          fetchAutocomplete(text);
        }}
        style={[{
          borderRadius: 30,
          paddingHorizontal: 20,
          flex: 1,
          color: props.color,
          fontSize: props.fontSize,
          fontFamily: props.fontFamily,
          height: props.wrapperHeight,
          width: props.wrapperWidth,
          flexDirection: 'row',
          backgroundColor:props?.disabled?theme?.theme.DARK_GREY_COLOR  :theme?.theme?.WHITE_COLOR,
          borderWidth: 1,
          borderColor: props?.showValidationError ? theme?.theme?.RED_COLOR : theme?.theme?.BLACK_COLOR,
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center',

      }, props.styles]}
      />
      <FlatList
        data={suggestions}
        keyExtractor={(item:any) => item.place_id}
        renderItem={({ item }:any) => (
          <TouchableOpacity onPress={() => handleSelect(item.place_id, item.description)}>
            <Text style={styles.suggestion}>{item.description}</Text>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
    </View>
  );
};

export default LocationSearchBox;

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#fff',
    marginTop: 5,
    borderRadius: 6,
    elevation: 3,
  },
  suggestion: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});
