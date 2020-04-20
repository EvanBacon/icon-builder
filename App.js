import React from "react";
import { StyleSheet, Button, Image, Text, View } from "react-native";
import "emoji-mart/css/emoji-mart.css";

import { Picker } from "emoji-mart";
import { SketchPicker } from "react-color";
import * as ImagePicker from "expo-image-picker";

import JSZip from "jszip";
import FileSaver from "file-saver";
import { createAppIcon, twitterEmoji } from "./ImageOps";

const App = () => {
  const [color, setColor] = React.useState("#ff00ff");
  const [chosenEmoji, setChosenEmoji] = React.useState("1f914");
  const [image, setImage] = React.useState(null);

  const onSelect = (data) => {
    console.log(data);

    setChosenEmoji(data.unified);
    setImage(null);
  };

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
        <AppIconImage color={color} emojiId={chosenEmoji} image={image} />
        {chosenEmoji ? (
          <Text>You chose: {chosenEmoji}</Text>
        ) : (
          <Text>No emoji Chosen</Text>
        )}
        <Button
          title="Download"
          onPress={async () => {
            const icon = await createAppIcon({
              color,
              emojiId: chosenEmoji,
              imageUrl: image,
              size: 1024,
              emojiPadding: 128,
            });
            setImage(icon);
            return;
            FileSaver.saveAs(
              icon,
              `icon-${new Date().toLocaleTimeString()}.png`
            );
            return;

            let zip = new JSZip();
            // icon 1024x1024 - emoji padding - 128
            // splash 2048x2048 - emoji padding - 1000 (524 icon)
            zip.file("icon.png", icon);
            // zip.file("splash.png", `hello`);
            // zip.file("favicon.ico", `hello`);
            const content = await zip.generateAsync({ type: "blob" });
            FileSaver.saveAs(content, `app-icons.zip`);
          }}
        />
      </Row>
      <Row>
        <Picker set="twitter" onSelect={onSelect} />
        <Button
          title="Upload Image"
          onPress={async () => {
            const file = await ImagePicker.launchImageLibraryAsync();
            console.log(file);
            if (!file.cancelled) {
              setImage(file.uri);
              setChosenEmoji(undefined);
            }
          }}
        />
      </Row>
    </View>
  );
};

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

function AppIconImage({ color, image, emojiId = "1f914" }) {
  const size = 96;
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

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
