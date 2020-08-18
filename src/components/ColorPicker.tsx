import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tinycolor from "tinycolor2";
import { useTheme } from "@react-navigation/native";

export const toState = (data, oldHue) => {
  const color = data.hex ? tinycolor(data.hex) : tinycolor(data);
  const hsl = color.toHsl();
  const hsv = color.toHsv();
  const rgb = color.toRgb();
  const hex = color.toHex();
  if (hsl.s === 0) {
    hsl.h = oldHue || 0;
    hsv.h = oldHue || 0;
  }
  const transparent = hex === "000000" && rgb.a === 0;

  return {
    hsl,
    hex: transparent ? "transparent" : `#${hex}`,
    rgb,
    hsv,
    oldHue: data.h || oldHue || hsl.h,
    source: data.source,
  };
};

export const getContrastingColor = (data) => {
  if (!data) {
    return "#fff";
  }
  const col = toState(data);
  if (col.hex === "transparent") {
    return "rgba(0,0,0,0.4)";
  }
  const yiq = (col.rgb.r * 299 + col.rgb.g * 587 + col.rgb.b * 114) / 1000;
  return yiq >= 128 ? "#000" : "#fff";
};

export const isValidHex = (hex) => {
  if (hex === "transparent") {
    return true;
  }
  // disable hex4 and hex8
  const lh = String(hex).charAt(0) === "#" ? 1 : 0;
  return (
    hex.length !== 4 + lh && hex.length < 7 + lh && tinycolor(hex).isValid()
  );
};

function ColorView({ isDark, size, color, style }) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: isDark ? "#555453" : "white",
          borderWidth: 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

export function ColorPicker({
  isMobile,
  onValueChanged,
  ...props
}: React.ComponentProps<typeof ScrollView> & {
  isMobile?: boolean;
  onValueChanged: (hex: string) => void;
}) {
  const theme = useTheme();
  const isDark = theme.dark;
  const [text, onTextChanged] = React.useState("FFFFFF");

  const COLOR_SIZE = 24;
  const PADDING = 12;
  const SCROLL_HEIGHT = COLOR_SIZE + PADDING * 2;
  const COLORS = React.useMemo(() => defaultColors.reverse(), []);
  return (
    <ScrollView
      {...props}
      style={[
        isMobile
          ? { minHeight: SCROLL_HEIGHT, maxHeight: SCROLL_HEIGHT }
          : { flexShrink: 1, flexGrow: 0, maxWidth: 300 },
        props.style,
      ]}
      contentContainerStyle={[
        { paddingVertical: PADDING },
        !isMobile && {
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
        },
        props.contentContainerStyle,
      ]}
      horizontal={isMobile}
      pagingEnabled
    >
      {COLORS.map((color) => (
        <TouchableOpacity onPress={() => onValueChanged(color)}>
          <ColorView
            size={COLOR_SIZE}
            color={color}
            isDark={isDark}
            style={{ margin: isMobile ? 12 : 6 }}
          />
        </TouchableOpacity>
      ))}
      <ColorPickerInput
        size={COLOR_SIZE}
        isDark={isDark}
        value={text}
        onValueChanged={onTextChanged}
        onSubmit={(value) => {
          onValueChanged(value);
        }}
      />
    </ScrollView>
  );
}

function ColorPickerInput({ isDark, size, value, onValueChanged, onSubmit }) {
  return (
    <View
      style={[
        {
          height: size,
          flex: 1,
          minWidth: 275,
          margin: 6,
          borderRadius: size / 2,
          borderWidth: 2,
          flexDirection: "row",
          overflow: "hidden",
        },
        isDark
          ? {
              borderColor: "#555453",
              backgroundColor: "#2f2f2f",
            }
          : {
              borderColor: "white",
              backgroundColor: "#ffffff",
            },
      ]}
    >
      <View
        style={{
          width: size,
          height: size - 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{ alignSelf: "center", color: isDark ? "#fff" : "#98A1A4" }}
        >
          #
        </Text>
      </View>
      <TextInput
        autoCapitalize={"none"}
        autoCorrect={false}
        value={value.replace("#", "")}
        onChangeText={(value) => {
          onValueChanged(value);

          if (isValidHex(value)) {
            onSubmit("#" + tinycolor(value).toHex());
          }
        }}
        style={{
          flex: 1,
          paddingHorizontal: 4,
          color: isDark ? "#fff" : "rgb(102, 102, 102)",
          outlineColor: "transparent",
        }}
      />
    </View>
  );
}

const defaultColors = [
  "#f44336",
  "#e91e63",
  "#EB144C",
  "#9900EF",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#7BDCB5",
  "#00D084",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#607d8b",
  "#999",
  "#ABB8C3",
  "black",
  "white",
];

export const randomColor = () =>
  defaultColors[Math.floor(Math.random() * defaultColors.length)];
