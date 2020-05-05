import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  HeaderStyleInterpolators,
} from "@react-navigation/stack";
import React from "react";
import {
  Provider as PaperProvider,
  DefaultTheme as PaperLightTheme,
  DarkTheme as PaperDarkTheme,
  Appbar,
  List,
  Divider,
} from "react-native-paper";
import { View } from "react-native";

import DarkModeSwitch from "expo-dark-mode-switch";
import Emoji from "./Emoji";
const Stack = createStackNavigator();

const DefaultTheme = {
  dark: false,
  colors: {
    primary: "rgb(0, 122, 255)",
    background: "rgb(242, 242, 242)",
    card: "rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    border: "rgb(224, 224, 224)",
  },
};

export default function App({}) {
  const [theme, setTheme] = React.useState(DefaultTheme);
  const [isDark, setDark] = React.useState(false);

  const paperTheme = React.useMemo(() => {
    const t = theme.dark ? PaperDarkTheme : PaperLightTheme;

    return {
      ...t,
      colors: {
        ...t.colors,
        ...theme.colors,
        surface: theme.colors.card,
        accent: theme.dark ? "rgb(255, 55, 95)" : "rgb(255, 45, 85)",
        header: theme.dark ? "#000" : "white",
        headerBorder: theme.dark
          ? "rgba(224,224,224, 0.3)"
          : "rgb(224,224,224)",
      },
    };
  }, [theme.colors, theme.dark]);

  const ref = React.useRef(null);

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
          }}
        >
          <Stack.Screen
            name="Home"
            options={{
              headerTintColor: paperTheme.colors.text,
              headerStyle: {
                backgroundColor: paperTheme.colors.header,
                borderBottomColor: paperTheme.colors.headerBorder,
              },
              title: "Icon Builder",
              headerLeft: () => (
                <Appbar.Action
                  color={paperTheme.colors.text}
                  icon="download"
                  onPress={() => {
                    ref.current.saveAsync();
                  }}
                />
              ),
              headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <DarkModeSwitch
                    value={paperTheme.dark}
                    onChange={() => {
                      setDark((isDark) => !isDark);

                      setTheme(isDark ? DefaultTheme : PaperDarkTheme);
                    }}
                  />
                  <Appbar.Action
                    color={paperTheme.colors.text}
                    icon="upload"
                    onPress={() => {
                      ref.current.uploadAsync();
                    }}
                  />
                </View>
              ),
            }}
          >
            {({ navigation }) => (
              <Emoji
                ref={ref}
                navigation={navigation}
                isDark={isDark}
                theme={paperTheme}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
