import * as Fonts from 'expo-font'
import React, { useState } from 'react';
import AppLoading from 'expo-app-loading'
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'

import ShopNavigator from './navigation/ShopNavigator'
import productsReducer from './store/reducers/products'
import authReducer from './store/reducers/auth'
import NavigationContainer from './navigation/NavigationContainer'

const loadFonts = () => {
  return (
    Fonts.loadAsync({
      'fontBold': require('./assets/fonts/OpenSans-Bold.ttf'),
      'fontRegular': require('./assets/fonts/OpenSans-Regular.ttf')
    })
  )
}

const root = combineReducers({
  products: productsReducer,
  auth: authReducer
})

const store = createStore(root, applyMiddleware(ReduxThunk))

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  if (!fontsLoaded) {
    return <AppLoading startAsync={loadFonts} onFinish={() => setFontsLoaded(true)} onError={console.log('Font Error')} />
  }

  return (
    <Provider store={store}>
      <NavigationContainer/>
    </Provider>
  )
}
