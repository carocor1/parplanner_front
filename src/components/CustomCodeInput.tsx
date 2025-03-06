import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import SmallLoadingIndicator from "./SmallLoadingIndicator";
import CancelButton from "./CancelButton";

interface CodeInputProps {
  value: string;
  setValue: (value: string) => void;
  cellCount: number;
  loading: boolean;
  loadingText: string;
  loadingColor: string;
  loadingTextColor: string;
  borderColor: string;
  focusBorderColor: string;
  focusTextColor: string;
  backColor: string;
  backColorIndicator: string;
}

const CustomCodeInput: React.FC<CodeInputProps> = ({
  value,
  setValue,
  cellCount,
  loading,
  loadingText,
  loadingColor,
  loadingTextColor,
  borderColor,
  focusBorderColor,
  focusTextColor,
  backColor,
  backColorIndicator,
}) => {
  const ref = useBlurOnFulfill({ value, cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const styles = StyleSheet.create({
    codeFieldRoot: { marginBottom: 20 },
    cell: {
      width: 50,
      height: 58,
      lineHeight: 43,
      fontSize: 30,
      fontWeight: "bold",
      color: "black",
      borderWidth: 3,
      borderColor: borderColor,
      textAlign: "center",
      margin: 3,
      backgroundColor: backColor,
      borderRadius: 6,
    },
    focusCell: {
      borderColor: focusBorderColor,
      color: focusTextColor,
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      backgroundColor: loadingColor,
    },
    loadingText: {
      color: loadingTextColor,
      fontWeight: "bold",
      marginTop: 8,
    },
  });

  return (
    <View>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={cellCount}
        rootStyle={styles.codeFieldRoot}
        keyboardType="name-phone-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      {loading && (
        <SmallLoadingIndicator
          text={loadingText}
          color={loadingColor}
          textColor={loadingColor}
          backColor={backColorIndicator}
        />
      )}
    </View>
  );
};

export default CustomCodeInput;
