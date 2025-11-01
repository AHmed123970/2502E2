import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';

import HomeScreen from '../screens/HomeScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import StockDetailScreen from '../screens/StockDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StockDetail"
        component={StockDetailScreen}
        options={{ title: 'Stock Details' }}
      />
      <Stack.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{ title: 'Watchlist' }}
      />
    </Stack.Navigator>
  );
};

const PortfolioStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="PortfolioMain"
        component={PortfolioScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StockDetail"
        component={StockDetailScreen}
        options={{ title: 'Stock Details' }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Portfolio') {
              iconName = focused ? 'briefcase' : 'briefcase-outline';
            } else if (route.name === 'Transactions') {
              iconName = focused ? 'list' : 'list-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.divider,
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{ title: 'Market' }}
        />
        <Tab.Screen
          name="Portfolio"
          component={PortfolioStack}
          options={{ title: 'Portfolio' }}
        />
        <Tab.Screen
          name="Transactions"
          component={TransactionsScreen}
          options={{ title: 'History' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
