import "emoji-mart/css/emoji-mart.css";

import { P } from "@expo/html-elements";
import { Picker } from "emoji-mart";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { SketchPicker } from "react-color";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { generateImagesAsync, twitterEmoji } from "./ImageOps";

const defaultEmoji = {
  id: "bacon",
  name: "Bacon",
  short_names: ["bacon"],
  colons: ":bacon:",
  emoticons: [],
  unified: "1f953",
  skin: null,
  native: "🥓",
};

export default React.forwardRef(({ navigation, theme }, ref) => {
  const [color, setColor] = React.useState("#4A90E2");
  const [chosenEmoji, setChosenEmoji] = React.useState(defaultEmoji);
  const [image, setImage] = React.useState(null);
  const emojiId = ((chosenEmoji || {}).unified || "").split("-")[0];

  async function uploadImageAsync() {
    const file = await ImagePicker.launchImageLibraryAsync();
    if (!file.cancelled) {
      setImage(file.uri);
      setChosenEmoji(null);
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
    console.log("Picked Emoji: ", data);
    navigation.setParams({ emoji: data.unified });

    setChosenEmoji(data);
    setImage(null);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Row style={{ flex: 1 }}>
        <SketchPicker
          color={color}
          onChangeComplete={({ hex }) => {
            setColor(hex);
          }}
        />
      </Row>
      <Row style={{ flex: 1 }}>
        <View style={{ alignItems: "center" }}>
          <AppIconImage
            size={128}
            onPress={uploadImageAsync}
            color={color}
            emojiId={emojiId}
            image={image}
          />
          <P style={{ opacity: 0.6, textAlign: "center" }}>
            Touch the icon to use a custom image.
          </P>
        </View>
      </Row>
      <Row>
        <Picker set="twitter" onSelect={onSelect} />
      </Row>
    </View>
  );
});

function Row({ style, ...props }) {
  return (
    <View
      style={[
        { flex: 1, alignItems: "center", justifyContent: "center" },
        style,
      ]}
      {...props}
    />
  );
}

function AppIconImage({ color, size, image, emojiId = "1f914", onPress }) {
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
    flexDirection: "row",
    backgroundColor: "#fff",
  },
});
