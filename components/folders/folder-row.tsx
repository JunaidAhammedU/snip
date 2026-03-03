import { View, Pressable } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    FadeIn,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { lightTap } from "@/lib/haptics";
import type { FolderWithCount } from "@/lib/types";
import { padNumber } from "@/lib/utils";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
    folder: FolderWithCount;
    index: number;
    onPress: (id: string) => void;
}

export function FolderRow({ folder, index, onPress }: Props) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View entering={FadeIn.delay(index * 60).duration(400)}>
            <AnimatedPressable
                style={animatedStyle}
                className="py-4"
                onPressIn={() => {
                    scale.value = withSpring(0.98, {
                        damping: 15,
                        stiffness: 400,
                    });
                }}
                onPressOut={() => {
                    scale.value = withSpring(1, {
                        damping: 15,
                        stiffness: 400,
                    });
                }}
                onPress={() => {
                    lightTap();
                    onPress(folder.id);
                }}
            >
                <View className="flex-row items-baseline gap-3">
                    <Text variant="number">{padNumber(index + 1)}</Text>
                    <Text className="text-2xl font-extrabold text-foreground tracking-tight">
                        {folder.name}
                    </Text>
                </View>
                <View className="mt-1 ml-8">
                    <Text variant="caption">
                        {padNumber(folder.noteCount)} notes
                    </Text>
                </View>
                <View className="mt-3 ml-8 h-px bg-border" />
            </AnimatedPressable>
        </Animated.View>
    );
}
