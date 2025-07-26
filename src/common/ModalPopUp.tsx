import React, { FC } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Dimensions,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

interface ModalPopUpProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  modalStyle?: ViewStyle;
}

const ModalPopUp: FC<ModalPopUpProps> = ({ visible, onDismiss, children, modalStyle }) => {
  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent
      onRequestClose={onDismiss}
    >
      <View style={[styles.overlay, { backgroundColor: '#00000090' }, modalStyle]}>
        <View style={styles.container}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    height: deviceHeight,
    width: deviceWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'transparent',
    paddingTop: 12,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
});

export default ModalPopUp;
