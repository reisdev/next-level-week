import React from 'react';
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./pages/Home"
import Points from "./pages/Points";
import Detail from "./pages/Detail";

const AppStack = createStackNavigator()

const Routes = () => {
    return <NavigationContainer>
        <AppStack.Navigator
            headerMode="none"
            screenOptions={{
                cardStyle: {
                    backgroundColor: "#f0f0f5"
                }
            }}>
            <AppStack.Screen name="home" component={Home} />
            <AppStack.Screen name="points" component={Points} />
            <AppStack.Screen name="detail" component={Detail} />
        </AppStack.Navigator>
    </NavigationContainer>
}

export default Routes;