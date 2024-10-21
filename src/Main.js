// Importing necessary libraries and components
import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native"; 
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; // For bottom tab navigation
import { createStackNavigator } from "@react-navigation/stack"; // For stack navigation within tabs
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer"; // For drawer navigation
import { useDispatch, useSelector } from "react-redux"; // Redux hooks to dispatch actions and select state
import { fetchUserData } from "./redux/actions"; // Redux action to fetch user data
import { firebaseAuth } from "./utils/DataHandler"; // Firebase authentication utilities
import { signOut } from "firebase/auth"; // Firebase signOut method
import Icon from 'react-native-vector-icons/FontAwesome';
// Importing screens for each part of the app
import Daily from "./screens/daily/Daily";
import Tasks from "./screens/tasks/Tasks";
import Calendar from "./screens/calendar/Calender";
import StudyPlan from "./screens/study/StudyPlan";
import Settings from "./screens/account/Settings";
import Preferences from "./screens/account/Preferences";
import Username from "./screens/account/Username";
import ChangePassword from "./screens/account/ChangePassword";
import AddTask from "./screens/tasks/AddTask";

// Navigators for tabs, stacks, and drawers
const Tab = createBottomTabNavigator(); // Bottom Tab Navigator
const Stack = createStackNavigator(); // Stack Navigator
const Drawer = createDrawerNavigator(); // Drawer Navigator

/**
 * Stack Navigator for the "Daily" screen.
 */
const DailyStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Daily" options={{ headerShown: false }}>
      {() => <Daily />} 
    </Stack.Screen>
    <Stack.Screen name="AddTask" options={{ headerShown: false }}>
      {() => <AddTask />}
    </Stack.Screen>

  </Stack.Navigator>
);

/**
 * Stack Navigator for the "Tasks" screen and its related screens.
 */
const TasksStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tasks" options={{ headerShown: false }}>
      {() => <Tasks />} 
    </Stack.Screen>
    {/* Add other screens related to Tasks here */}
  </Stack.Navigator>
);

/**
 * Stack Navigator for the "Calendar" screen.
 */
const CalendarStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Calendar" options={{ headerShown: false }}>
      {() => <Calendar />} 
    </Stack.Screen>
  </Stack.Navigator>
);

/**
 * Stack Navigator for the "Study Plan" screen.
 */
const StudyPlanStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Study Plan" options={{ headerShown: false }}>
      {() => <StudyPlan />} 
    </Stack.Screen>
  </Stack.Navigator>
);

/**
 * Stack Navigator for the "Settings" and related screens.
 */
const SettingsStack = () => {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen name="SettingsScreen" options={{ headerShown: false }}>
        {({ navigation }) => <Settings navigation={navigation} />} 
      </Stack.Screen>
      <Stack.Screen name="Username" options={{ headerShown: false }}>
        {({ navigation }) => <Username navigation={navigation} />} 
      </Stack.Screen>
      <Stack.Screen name="ChangePassword" options={{ headerShown: false }}>
        {({ navigation }) => <ChangePassword navigation={navigation} />} 
      </Stack.Screen>
    </Stack.Navigator>
  );
};

/**
 * Drawer Navigator that wraps around the Bottom Tab Navigator.
 * Contains the "Settings" and "Preferences" options as drawer items.
 */
const DrawerNavigator = ({ isDarkTheme, toggleTheme }) => (
  <Drawer.Navigator
    initialRouteName="Home"
    drawerContent={(props) => {
      return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          {/* Logout button */}
          <DrawerItem label="Logout" onPress={() => signOut(firebaseAuth)} /> 
        </DrawerContentScrollView>
      );
    }}
  >
    <Drawer.Screen name="Home" options={{ title: "Home" }}>
      {() => <BottomTabNavigator />} 
    </Drawer.Screen>
    <Drawer.Screen name="Settings" options={{ title: "Settings" }}>
      {() => <SettingsStack />} 
    </Drawer.Screen>
    <Drawer.Screen name="Preferences">
      {() => <Preferences toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />} 
    </Drawer.Screen>
  </Drawer.Navigator>
);

/**
 * Bottom Tab Navigator that contains the main navigation tabs for the app.
 * It uses the Stack Navigators for each section (Daily, Tasks, Calendar, Study Plan).
 */
const BottomTabNavigator = () => (
  <Tab.Navigator
    // Configure screen options for each tab
    screenOptions={({ route }) => ({
      // Define the icon for each tab based on the route name
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        // Set icon name based on the route name and focus state, this is an Icon that will be displayed over the tab screen
        if (route.name === 'DailyStack') {
          iconName = focused ? 'calendar' : 'calendar-o';
        } else if (route.name === 'TasksStack') {
          iconName = focused ? 'tasks' : 'tasks';
        } else if (route.name === 'CalendarStack') {
          iconName = focused ? 'calendar-check-o' : 'calendar';
        } else if (route.name === 'StudyPlanStack') {
          iconName = focused ? 'book' : 'book';
        }

        // Return the icon component
        return <Icon name={iconName} size={size} color={color} />;
      },
      // Define the label for each tab based on the route name
      tabBarLabel: ({ focused }) => {
        const label = route.name.replace('Stack', '');
        return (
          <Text
            style={{
              fontSize: 12,
              fontWeight: focused ? 'bold' : 'normal',
              color: focused ? '#000' : '#888',
            }}
          >
            {label}
          </Text>
        );
      },
      // Set active and inactive tint colors for the tab bar
      tabBarActiveTintColor: '#000',
      tabBarInactiveTintColor: '#888',
      // Style the tab bar
      tabBarStyle: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderTopWidth: 0,
        elevation: 5,
      },
    })}
  >
    {/* Define each tab screen and its corresponding stack navigator */}
    <Tab.Screen name="DailyStack" component={DailyStack} options={{ title: 'Daily', headerShown: false }} />
    <Tab.Screen name="TasksStack" component={TasksStack} options={{ title: 'Tasks', headerShown: false }} />
    <Tab.Screen name="CalendarStack" component={CalendarStack} options={{ title: 'Calendar', headerShown: false }} />
    <Tab.Screen name="StudyPlanStack" component={StudyPlanStack} options={{ title: 'Study Plan', headerShown: false }} />
  </Tab.Navigator>
);

/**
 * The main component that initializes the app and handles user state.
 * It fetches user data and displays a loading indicator if data is still being fetched.
 * It also passes the `isDarkTheme` and `toggleTheme` props to the DrawerNavigator.
 */
const Main = ({ isDarkTheme, toggleTheme }) => {
  const dispatch = useDispatch(); // Redux's dispatch function
  const userData = useSelector((state) => state.userData); // Get user data from Redux store

  // Fetch user data when the component mounts if not already present
  useEffect(() => {
    if (!userData) {
      dispatch(fetchUserData()); // Fetch user data from Firestore and store in Redux
    }
  }, []);

  // State to track loading status
  const [isLoading, setIsLoading] = useState(true); 

  // Set loading state to false once userData is available
  useEffect(() => {
    if (userData) {
      setIsLoading(false);
    }
  }, [userData]);

  // Show a loading screen while data is being fetched
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",

        }}
      >
        {/* Add a loading indicator component here */}
      </View>
    );
  }

  // Render the DrawerNavigator once data is loaded
  return <DrawerNavigator isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />;
};
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor:'black'
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  tabBarIcon: {
    width: 24,
    height: 24,
  },
});
export default Main;