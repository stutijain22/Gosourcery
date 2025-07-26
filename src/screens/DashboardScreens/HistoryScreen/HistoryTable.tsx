// components/HistoryTable.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';

const HistoryTable = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return <Text>No data found</Text>;

  const headers = Object.keys(data[0]);

  return (
    <ScrollView horizontal>
      <View>
        {/* Headers */}
        <View style={styles.row}>
          {headers.map((header) => (
            <Text style={[styles.cell, styles.header]} key={header}>
              {header}
            </Text>
          ))}
        </View>

        {/* Rows */}
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            <View style={styles.row}>
              {headers.map((header) => (
                <Text style={styles.cell} key={header}>
                  {String(item[header])}
                </Text>
              ))}
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
  },
  cell: {
    padding: 8,
    minWidth: 100,
    borderRightWidth: 0.5,
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
});

export default HistoryTable;
