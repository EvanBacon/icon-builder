import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { twitterEmoji } from "../utils/ImageOps";

export function AppIconImage({
  color,
  size,
  image,
  emojiId,
  onPress,
}: {
  color: string;
  size: number;
  image?: any;
  emojiId?: string;
  onPress: () => void;
}) {
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
