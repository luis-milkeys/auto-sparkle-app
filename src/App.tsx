import React from 'react';
import { StatusBar } from 'react-native';

import * as eva from '@eva-design/eva';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ImagesScreen from './screens/ImagesScreen';
import SettingsScreen from './screens/SettingsScreen';
import QueueScreen from './screens/QueueScreen';
import { isDarkMode, autoSparkleColor, autoSparkleColorDark } from './constants/colors';
import { MaterialIconsPack } from './utils/MaterialIconsProxy';

import PlaceholderText from './components/PlaceholderText';

const Tab = createMaterialTopTabNavigator();

export default function App(): JSX.Element {
  const tabMenuIcons = {
    images: ({ color }: { color: string }) => <Icon name="image-search" size={20} color={color} />,
    queue: ({ color }: { color: string }) => <Icon name="file-download" size={20} color={color} />,
    analytics: ({ color }: { color: string }) => <Icon name="insights" size={20} color={color} />,
    settings: ({ color }: { color: string }) => <Icon name="settings" size={20} color={color} />,
  };

  return (
    <>
      <IconRegistry icons={MaterialIconsPack} />
      <ApplicationProvider {...eva} theme={isDarkMode ? eva.dark : eva.light}>
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
          <StatusBar backgroundColor={autoSparkleColorDark} />
          <Tab.Navigator
            initialRouteName="Images"
            screenOptions={{
              tabBarActiveTintColor: autoSparkleColor,
              tabBarInactiveTintColor: '#b6b6b6',
              tabBarIndicatorStyle: {
                backgroundColor: autoSparkleColor,
              },
              tabBarShowLabel: false,
            }}
          >
            <Tab.Group>
              <Tab.Screen
                name="Images"
                component={ImagesScreen}
                options={{
                  tabBarIcon: tabMenuIcons.images,
                }}
              />
              <Tab.Screen
                name="Queue"
                component={QueueScreen}
                options={{
                  tabBarIcon: tabMenuIcons.queue,
                }}
              />
              {/* <Tab.Screen
                name="Analytics"
                component={PlaceholderText}
                options={{
                  tabBarIcon: tabMenuIcons.analytics,
                }}
              /> */}
              <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  tabBarIcon: tabMenuIcons.settings,
                }}
              />
            </Tab.Group>
          </Tab.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}
