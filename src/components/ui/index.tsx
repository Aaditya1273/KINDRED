/* eslint-disable react-refresh/only-export-components */
import Svg from 'react-native-svg';
import { withUniwind } from 'uniwind';

export * from './button';
export * from './checkbox';
export { default as colors } from './colors';
export * from './focus-aware-status-bar';
export * from './image';
export * from './input';
export * from './list';
export * from './modal';
export * from './progress-bar';
export * from './select';
export * from './text';
export * from './utils';

import {
  ActivityIndicator as RNActivityIndicator,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView,
} from 'react-native';

export const ActivityIndicator = withUniwind(RNActivityIndicator);
export const Pressable = withUniwind(RNPressable);
export const ScrollView = withUniwind(RNScrollView);
export const TextInput = withUniwind(RNTextInput);
export const TouchableOpacity = withUniwind(RNTouchableOpacity);
export const View = withUniwind(RNView);

export { SafeAreaView } from 'react-native-safe-area-context';

// Apply withUniwind to Svg to add className support
export const StyledSvg = withUniwind(Svg);
