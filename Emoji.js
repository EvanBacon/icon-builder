import "emoji-mart/css/emoji-mart.css";

import { P } from "@expo/html-elements";
import { Picker } from "emoji-mart";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import Circle from "react-color/lib/Twitter";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { generateImagesAsync, twitterEmoji } from "./ImageOps";

const defaultEmojis = [
  {
    id: "bacon",
    unified: "1f953",
  },
  { id: "avocado", unified: "1f951" },
  { id: "beers", unified: "1f37b" },
  { id: "microbe", unified: "1f9a0" },
  {
    id: "i_love_you_hand_sign",
    unified: "1f91f",
  },
  {
    id: "mechanical_arm",
    unified: "1f9be",
  },
  {
    id: "revolving_hearts",

    unified: "1f49e",
  },
  {
    id: "thought_balloon",
    unified: "1f4ad",
  },
  {
    id: "dog",
    unified: "1f436",
  },
];

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
  "#fff",
];

const randomEmoji = () =>
  defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)];
const randomColor = () =>
  defaultColors[Math.floor(Math.random() * defaultColors.length)];

const defaultEmoji = randomEmoji();
const defaultColor = "#fff";

export default React.forwardRef(({ navigation, theme, isDark }, ref) => {
  const [color, setColor] = React.useState(defaultColor);
  const [chosenEmoji = {}, setEmoji] = React.useState(defaultEmoji);
  const [image, setImage] = React.useState(null);
  let emojiId = chosenEmoji.unified || "";
  if (!chosenEmoji.id.startsWith("flag-")) {
    emojiId = chosenEmoji.unified.split("-")[0] || "";
  }

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
    navigation.setParams({ emoji: data.unified });

    setEmoji(data);
    setImage(null);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <View style={{ marginBottom: 8, opacity: 0.8 }}>
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
          <AppIconImage
            size={128}
            onPress={uploadImageAsync}
            color={color}
            emojiId={emojiId}
            image={image}
          />
          <P
            style={{
              opacity: 0.6,
              color: theme.colors.text,
              textAlign: "center",
            }}
          >
            Touch the icon to use a custom image.
          </P>
          <Circle
            triangle="hide"
            colors={defaultColors}
            color={color}
            onChangeComplete={({ hex }) => {
              setColor(hex);
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Picker
          theme={isDark ? "dark" : "light"}
          set="twitter"
          notFoundEmoji="mag"
          color={isDark ? "white" : "#4630eb"}
          title="By Evan Bacon"
          emoji="bacon"
          onSelect={onSelect}
          showSkinTones={false}
        />
      </View>
    </View>
  );
});

function AppIconImage({ color, size, image, emojiId, onPress }) {
  const imgSize = size * 0.75;

  let imageContents;

  if (image) {
    imageContents = (
      <Image
        source={{ uri: image }}
        style={{ resizeMode: "cover", width: size, height: size, flex: 1 }}
      />
    );
  } else {
    imageContents = (
      <Image
        source={{ uri: twitterEmoji(emojiId) }}
        style={{ width: imgSize, height: imgSize, resizeMode: "contain" }}
      />
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,

          elevation: 3,
          width: size,
          height: size,
          borderRadius: size * 0.3,
          backgroundColor: color,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {imageContents}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
