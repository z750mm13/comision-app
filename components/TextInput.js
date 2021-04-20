import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import PropTypes from 'prop-types';

import { argonTheme } from "../constants";

class ArTextInput extends React.Component {
  render() {
    const { shadowless, success, error } = this.props;

    const inputStyles = [
      styles.input,
      !shadowless && styles.shadow,
      success && styles.success,
      error && styles.error,
      {...this.props.style}
    ];

    return (
      <View
      style={inputStyles}
      >
        <TextInput
          placeholder="write something here"
          placeholderTextColor={argonTheme.COLORS.MUTED}
          multiline={true}
          numberOfLines={4}
          placeholder='Enter description...'
          textAlignVertical={'top'}
          color={argonTheme.COLORS.HEADER}
          {...this.props}
        />
      </View>
    );
  }
}

ArTextInput.defaultProps = {
  shadowless: false,
  success: false,
  error: false
};

ArTextInput.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 4,
    borderColor: argonTheme.COLORS.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF'
  },
  success: {
    borderColor: argonTheme.COLORS.INPUT_SUCCESS,
  },
  error: {
    borderColor: argonTheme.COLORS.INPUT_ERROR,
  },
  shadow: {
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
    elevation: 2,
  }
});

export default ArTextInput;
