// GlobalModal.js
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import Signup from '../components/Signup';
import useModalStore from '../zustand/ModalStore';

const GlobalModal = () => {
  const { isVisible, closeModal } = useModalStore();

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={closeModal}
      >
        <View style={styles.modalContainer}>
          <Signup setSignInPopUp={closeModal} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default GlobalModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    elevation: 5,
    minHeight: 400,
    justifyContent: 'flex-end',
  },
});
