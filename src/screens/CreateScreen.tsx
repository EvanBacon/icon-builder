import { P } from "@expo/html-elements";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

import { AppIconImage } from "../components/AppIconImage";
import { ColorPicker, randomColor } from "../components/ColorPicker";
import {
  EmojiPicker,
  randomEmoji,
  transformId,
} from "../components/EmojiPicker";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { generateImagesAsync } from "../utils/ImageOps";

const defaultEmoji = randomEmoji();
const defaultColor = "#fff";

export default React.forwardRef((props, ref) => {
  const theme = useTheme();
  const [color, setColor] = React.useState(defaultColor);
  const [chosenEmoji = {}, setEmoji] = React.useState(defaultEmoji);
  const [image, setImage] = React.useState(null);
  const chosenUnified = chosenEmoji?.unified ?? null;
  const chosenId = chosenEmoji?.id ?? null;
  let emojiId = transformId(chosenUnified, chosenId);

  const { width } = useWindowDimensions();

  const isMobile = width < 640;

  async function uploadImageAsync() {
    const file = await ImagePicker.launchImageLibraryAsync();
    if (!file.cancelled) {
      setImage(file.uri);
      setEmoji(null);
    }
  }

  React.useImperativeHandle(
    ref,
    () => ({
      async saveAsync() {
        await generateImagesAsync({ emojiId, image, color });
      },
      async uploadAsync() {
        await uploadImageAsync();
      },
    }),
    [emojiId, image, color]
  );

  const onSelect = (data) => {
    console.log("Emoji: ", data);
    // navigation.setParams({ emoji: data.unified });

    setEmoji(data);
    setImage(null);
  };

  const renderAppIcon = () => (
    <>
      <AppIconImage
        size={128}
        onPress={uploadImageAsync}
        color={color}
        emojiId={emojiId}
        image={image}
      />
      <View style={{ marginTop: 8, opacity: 0.8 }}>
        <FontAwesome.Button
          name="refresh"
          backgroundColor="transparent"
          underlayColor={theme.colors.header}
          color={theme.colors.text}
          onPress={() => {
            setColor(randomColor());
            setEmoji(randomEmoji());
          }}
        >
          Random
        </FontAwesome.Button>
      </View>
      {false && (
        <P
          style={{
            opacity: 0.6,
            color: theme.colors.text,
            textAlign: "center",
          }}
        >
          Touch the icon to use a custom image.
        </P>
      )}
    </>
  );

  const renderDownloadButton = () => (
    <DownloadButton
      color={theme.colors.text}
      style={{ marginTop: 12 }}
      onPress={() => {
        generateImagesAsync({ emojiId, image, color });
      }}
    />
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingVertical: isMobile ? 18 : 0,
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      <View
        style={[
          styles.rowItem,
          {
            paddingVertical: isMobile ? 18 : 0,
          },
        ]}
      >
        {renderAppIcon()}
        <ColorPicker onValueChanged={(hex) => setColor(hex)} />
      </View>
      <View style={styles.rowItem}>
        <EmojiPicker isMobile={isMobile} onSelect={onSelect} />
      </View>
    </View>
  );
});

function DownloadButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button {...props} mode="outlined" uppercase={false} icon="download">
      Download Icon
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  rowItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
