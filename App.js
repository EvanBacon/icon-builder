import "emoji-mart/css/emoji-mart.css";

import { Picker } from "emoji-mart";
import * as ImagePicker from "expo-image-picker";
import FileSaver from "file-saver";
import JSZip from "jszip";
import React from "react";
import { SketchPicker } from "react-color";
import { Button, Image, StyleSheet, View } from "react-native";

import { createAppIcon, twitterEmoji } from "./ImageOps";

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

export default function App() {
  const [color, setColor] = React.useState("#4A90E2");
  const [chosenEmoji, setChosenEmoji] = React.useState(defaultEmoji);
  const [image, setImage] = React.useState(null);

  const onSelect = (data) => {
    console.log(JSON.stringify(data));

    setChosenEmoji(data);
    setImage(null);
  };

  const emojiId = (chosenEmoji || {}).unified;

  async function downloadImageAsync() {
    const splash = await createAppIcon({
      color,
      emojiId: emojiId,
      imageUrl: image,
      size: 2048,
      emojiPadding: 832,
    });

    const icon = await createAppIcon({
      color,
      emojiId: emojiId,
      imageUrl: image,
      size: 1024,
      emojiPadding: 128,
    });
    const faviconPng = await createAppIcon({
      color: "transparent",
      emojiId: emojiId,
      imageUrl: image,
      size: 32,
      emojiPadding: 0,
    });

    const iconB64 = icon.substring(icon.indexOf("base64,") + "base64,".length);
    const splashB64 = splash.substring(
      splash.indexOf("base64,") + "base64,".length
    );
    const faviconB64 = faviconPng.substring(
      faviconPng.indexOf("base64,") + "base64,".length
    );

    let zip = new JSZip();
    // icon 1024x1024 - emoji padding - 128
    // splash 2048x2048 - emoji padding - 1000 (524 icon)
    zip.file("icon.png", iconB64, { base64: true });
    zip.file("splash.png", splashB64, { base64: true });
    zip.file("favicon.png", faviconB64, { base64: true });
    const content = await zip.generateAsync({ type: "blob" });

    const folderName = image
      ? `app-icons-${image.slice(0, 10)}.zip`
      : `app-icons-${chosenEmoji.id}-${color}.zip`;
    FileSaver.saveAs(content, folderName);
  }

  return (
    <View style={styles.container}>
      <Row style={{ flex: 1 }}>
        <SketchPicker
          color={color}
          onChangeComplete={({ hex }) => {
            setColor(hex);
          }}
        />
      </Row>
      <Row style={{ flex: 1 }}>
        <AppIconImage
          size={128}
          color={color}
          emojiId={emojiId}
          image={image}
        />
        <View style={{ padding: 24, flexDirection: "row" }}>
          <Button title="Download" onPress={downloadImageAsync} />

          <Button
            title="Upload Image"
            onPress={async () => {
              const file = await ImagePicker.launchImageLibraryAsync();
              console.log(file);
              if (!file.cancelled) {
                setImage(file.uri);
                setChosenEmoji(null);
              }
            }}
          />
        </View>
      </Row>
      <Row>
        <Picker set="twitter" onSelect={onSelect} />
      </Row>
    </View>
  );
}

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

function AppIconImage({ color, size, image, emojiId = "1f914" }) {
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
});
