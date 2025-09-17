import {StyleSheet, ViewStyle} from 'react-native';
import {theme1} from '../../styling/themes';
import {deviceWidth} from '../../styling/mixin';

interface Styles {
  qrCodeContainer: ViewStyle;
  rowStyle: ViewStyle;
  rowStyleOne: ViewStyle;
  rowStyleTwo: ViewStyle;
  rowStyleThree: ViewStyle;
  rowStyleFour: ViewStyle;
  columnStyle: ViewStyle;
  columnStyleOne: ViewStyle;
  imageViewStyle: ViewStyle;
  imageViewStyleOne: ViewStyle;
  containerStyle: ViewStyle;
  containerHistoryStyle: ViewStyle;
  selectViewStyle: ViewStyle;
  containerStyleSelected: ViewStyle;
  tabViewContainerStyle: ViewStyle;
  notesView: ViewStyle;
  sentViewStyle: ViewStyle;
  sentIconStyle: ViewStyle;
  pendingViewStyle: ViewStyle;
  pendingIconStyle: ViewStyle;
  modalViewStyle: ViewStyle;
  crossViewStyle: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  qrCodeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme1?.BLACK_COLOR,
    borderRadius: 150,
    width: 300,
    height: 300,
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowStyleOne: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowStyleTwo: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowStyleThree: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowStyleFour: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    marginRight: 30,
  },
  columnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnStyleOne: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  imageViewStyle: {
    width: 35,
    height: 35,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewStyleOne: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    marginHorizontal: 10,
    backgroundColor: theme1?.WHITE_COLOR,
  },
  containerStyleSelected: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: theme1?.GREEN_COLOR,
    backgroundColor: theme1?.WHITE_COLOR,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  selectViewStyle: {
    height: 55,
    width: deviceWidth - 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme1?.WHITE_COLOR,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
  },
  tabViewContainerStyle: {
    backgroundColor: theme1.WHITE_COLOR,
    borderRadius: 10,
    width: deviceWidth - 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    height: 40,
  },
  containerHistoryStyle: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    marginVertical: 8,
    borderRadius: 10,
    marginHorizontal: 20,
    backgroundColor: theme1?.WHITE_COLOR,
  },
  notesView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  sentViewStyle: {
    backgroundColor: '#00a77420',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
  },
  sentIconStyle: {
    backgroundColor: theme1?.GREEN_COLOR,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  pendingViewStyle: {
    backgroundColor: '#F06F0020',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
  },
  pendingIconStyle: {
    backgroundColor: theme1?.YELLOW_COLOR,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  modalViewStyle: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 25,
    borderRadius: 20,
  },
  crossViewStyle: {
    position: 'absolute',
    right: 10,
    top: 10,
    height: 25,
    width: 25,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
