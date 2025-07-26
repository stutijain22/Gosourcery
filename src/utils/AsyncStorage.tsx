/**
* @storeDate - to store the single string data to the local storage.
 * @getData - to get the single string stored data from the local storage.
 * @storeJsonDate - to store the whole object or array to the local storage.
 * @getJsonData - to retrieve the json object or array from the local storage.
* */

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error: any) {
        console.error('AsyncStorage storeData error: ' + error.message);
    }
};

export const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (error: any) {
        console.error('AsyncStorage getData error: ' + error.message);
    }
};

export const storeJSONData = async (key: string, value: any) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error: any) {
        console.error('AsyncStorage storeJSONData error: ' + error.message);
    }
};


export const getJSONData = async (key: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error: any) {
        console.error('AsyncStorage getJSONData error: ' + error.message);
    }
};

export const clearStore = async (key: string) => {
    try {
        await AsyncStorage.setItem(key, "");
    } catch (error: any) {
        console.error('AsyncStorage clearStore error: ' + error.message);
    }
};