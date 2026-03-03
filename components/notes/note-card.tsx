import { View, Pressable } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    FadeIn,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import type { NotePreview } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { lightTap } from "@/lib/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
    note: NotePreview;
    index: number;
    onPress: (id: string) => void;
}

export function NoteCard({ note, index, onPress }: Props) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const isDark = note.colorTag === "purple";
    const bgClass =
        note.colorTag === "yellow"
            ? "bg-accent-yellow"
            : note.colorTag === "purple"
                ? "bg-card-dark"
                : "bg-card";
    const textColor = isDark ? "text-white" : "text-foreground";
    const captionColor = isDark ? "text-white/60" : "text-muted-foreground";

    return (
        <Animated.View
            entering={FadeIn.delay(index * 50).duration(350)}
            className="flex-1"
        >
            <AnimatedPressable
                style={animatedStyle}
                className={`${bgClass} rounded-2xl border border-border p-3.5 min-h-[120px]`}
                onPressIn={() => {
                    scale.value = withSpring(0.96, {
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
                    onPress(note.id);
                }}
            >
                <Text
                    className={`text-base font-bold ${textColor}`}
                    numberOfLines={2}
                >
                    {note.title}
                </Text>
                <Text className={`text-xs mt-1.5 ${captionColor}`} numberOfLines={3}>
                    {note.excerpt}
                </Text>
                <View className="flex-row items-center justify-between mt-auto pt-3">
                    {note.isPinned && (
                        <View className={`px-2 py-0.5 rounded ${isDark ? "bg-white/20" : "bg-primary"}`}>
                            <Text className={`text-[10px] font-semibold ${isDark ? "text-white" : "text-primary-foreground"}`}>
                                Pinned
                            </Text>
                        </View>
                    )}
                    <Text className={`text-[10px] ml-auto ${captionColor}`}>
                        {formatDate(note.updatedAt)}
                    </Text>
                </View>
            </AnimatedPressable>
        </Animated.View>
    );
}
