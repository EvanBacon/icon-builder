import { P } from "@expo/html-elements";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { EmojiData, emojiIndex } from "emoji-mart";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import tinycolor from "tinycolor2";

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

function searchForEmoji(emojiId?: string): EmojiData | null {
  if (!emojiId) return null;
  const results = emojiIndex.search(emojiId);
  if (!results) return null;

  return results[0];
}

function normalizeColorForURL(color: string): string {
  if (color.startsWith("#")) {
    return tinycolor(color).toHex();
  }
  // allow for CSS named colors
  return color;
}

export default React.forwardRef(
  (
    {
      navigation,
      route,
    }: StackNavigationProp<
      { Home: { emoji?: string; image?: string; color?: string } },
      "Home"
    >,
    ref
  ) => {
    const theme = useTheme();
    const [color, setColor] = React.useState(
      route.params?.color
        ? "#" + tinycolor(route.params.color).toHex()
        : defaultColor
    );
    const [chosenEmoji = {}, setEmoji] = React.useState<EmojiData | null>(
      searchForEmoji(route.params?.emoji) ?? defaultEmoji
    );
    const [image, setImage] = React.useState<string | null>(
      route.params?.image ? decodeURIComponent(route.params?.image) : null
    );
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
        navigation.setParams({
          // images are often too big
          //   image: encodeURIComponent(file.uri),
          emoji: undefined,
        });
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

    function setColorAndUpdateURL(color: string) {
      console.log("Selected Color", color);

      setColor(color);
      navigation.setParams({ color: normalizeColorForURL(color) });
    }
    function setEmojiAndUpdateURL(emoji: EmojiData) {
      console.log("Selected Emoji", emoji);

      navigation.setParams({ emoji: emoji.id });
      setEmoji(emoji);
      // reset custom image
      setImage(null);
    }

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
              setColorAndUpdateURL(randomColor());
              setEmojiAndUpdateURL(randomEmoji());
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
          <ColorPicker
            onValueChanged={(hex) => {
              setColorAndUpdateURL(hex);
            }}
          />
        </View>
        <View style={styles.rowItem}>
          <EmojiPicker isMobile={isMobile} onSelect={setEmojiAndUpdateURL} />
        </View>
      </View>
    );
  }
);

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
