import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Link } from 'react-router-native';

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    padding: 20,
    fontWeight: '200',
    fontSize: 18,
  },
});

interface Props {
  text: string;
  to: string;
}

const AppBarTab: React.FC<Props> = ({ text, to }) => {
  return (
    <Link to={to}>
      <Text style={styles.text}>{text}</Text>
    </Link>
  );
};

export default AppBarTab;
