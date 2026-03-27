import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function TestScreen() {
    const [count, setCount] = useState(0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>KINDRED TEST BOX</Text>
            <Text style={styles.text}>Click Count: {count}</Text>
            <Pressable
                onPress={() => setCount(c => c + 1)}
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: pressed ? '#00E0F0' : '#00F2FF' }
                ]}
            >
                <Text style={styles.buttonText}>CLICK ME</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#00F2FF',
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 40,
    },
    button: {
        paddingHorizontal: 40,
        paddingVertical: 20,
        borderRadius: 12,
    },
    buttonText: {
        color: '#0A0A0B',
        fontWeight: '800',
        fontSize: 18,
    }
});
