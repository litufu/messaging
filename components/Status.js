import { Constants } from 'expo';
import {
  NetInfo,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';

export default class Status extends React.Component {
  state = {
    connectionType: null,
  };

  async componentWillMount() {
    this.subscription = NetInfo.addEventListener(
      'connectionChange',
      this.handleChange,
    );

    const { type } = await NetInfo.getConnectionInfo();
    this.setState({ connectionType: type });
    // setTimeout(() => this.handleChange('none'), 100);
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  handleChange = connectionType => {
    this.setState({ connectionType });
    StatusBar.setBarStyle(connectionType === 'none' ? 'light-content' : 'dark-content');
  };

  render() {
    const { connectionType } = this.state;

    const isConnected = connectionType !== 'none';

    const backgroundColor = isConnected ? 'white' : 'red';

    const messageContainer = (
      <View style={styles.messageContainer} pointerEvents={'none'}>
        {!isConnected && (
          <View style={styles.bubble}>
            <Text style={styles.text}>网络连接失败</Text>
          </View>
        )}
      </View>
    );

    if (Platform.OS === 'ios') {
      return (
        <View style={[styles.status, { backgroundColor }]}>
          {messageContainer}
        </View>
      );
    }

    return messageContainer;
  }
}

const statusHeight = Platform.OS === 'ios' ? Constants.statusBarHeight : 0;

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: statusHeight + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: 'center',
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  text: {
    color: 'white',
  },
});
