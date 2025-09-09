import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {Ionicons} from "@expo/vector-icons";

type TabType = 'duration' | 'permanent' | 'repeatable';

interface TaskTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TaskTabs({ activeTab, onTabChange }: TaskTabsProps) {
  const tabs = [
    { key: 'duration' as TabType, icon: 'time' },
    { key: 'permanent' as TabType, icon: 'infinite' },
    { key: 'repeatable' as TabType, icon: 'refresh' },
  ];

  return (
      <View style={styles.container}>
        {tabs.map((tab) => (
            <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                onPress={() => onTabChange(tab.key)}
            >
              <Ionicons
                  name={tab.icon as any}
                  size={20}
                  color={activeTab === tab.key ? '#ff3636' : '#8E8E93'}
              />
            </TouchableOpacity>
        ))}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#ffdada',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});