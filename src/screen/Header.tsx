import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { theme } = useTheme();
    const navigation = useNavigation();

    return (
        <View style={[styles.headerContainer, { backgroundColor: theme.background }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.screenTitle, { color: theme.text }]}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    backButton: {
        marginRight: 10,
        padding: 8,
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default Header;
