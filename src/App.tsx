import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
} from "@react-navigation/native";
import {
  createStackNavigator,
  HeaderStyleInterpolators,
} from "@react-navigation/stack";
import DarkModeSwitch from "expo-dark-mode-switch";
import * as Linking from "expo-linking";
import React from "react";
import { View } from "react-native";
import { Appbar, Button } from "react-native-paper";

import CreateScreen from "./screens/CreateScreen";

const Stack = createStackNavigator();

const linking = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Home: {
        path: "",
      },
    },
  },
};

const CustomLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    accent: "rgb(255, 45, 85)",
    header: "white",
    headerBorder: "rgb(224,224,224)",
  },
};
const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    accent: "rgb(255, 55, 95)",
    header: "#000",
    headerBorder: "rgba(224,224,224, 0.3)",
  },
};

export default function App({}) {
  const [theme, setTheme] = React.useState(CustomLightTheme);
  const ref = React.useRef(null);

  return (
    <NavigationContainer theme={theme} linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
        }}
      >
        <Stack.Screen
          name="Home"
          options={{
            headerTintColor: theme.colors.text,
            headerStyle: {
              backgroundColor: theme.colors.background,
              borderBottomColor: theme.colors.headerBorder,
            },
            title: "",
            headerLeft: () => (
              <Button
                style={{ marginLeft: 8 }}
                color={theme.colors.text}
                onPress={() => ref.current.saveAsync()}
                uppercase
                labelStyle={{ userSelect: "none" }}
                icon={() => (
                  <MaterialIcons
                    style={{ userSelect: "none" }}
                    name="file-download"
                    color={theme.colors.text}
                    size={24}
                  />
                )}
              >
                Download Icon
              </Button>
            ),
            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <DarkModeSwitch
                  value={theme.dark}
                  onChange={() => {
                    setTheme((theme) =>
                      theme.dark ? CustomLightTheme : CustomDarkTheme
                    );
                  }}
                />
                <Appbar.Action
                  color={theme.colors.text}
                  icon="upload"
                  onPress={() => ref.current?.uploadAsync?.()}
                />
              </View>
            ),
          }}
        >
          {() => <CreateScreen ref={ref} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
