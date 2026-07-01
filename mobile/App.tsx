import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/store/AuthContext';
import { ExpenseProvider } from './src/store/ExpenseContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </ExpenseProvider>
    </AuthProvider>
  );
}
