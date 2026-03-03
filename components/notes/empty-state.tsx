import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";

export function EmptyState() {
    return (
        <Animated.View
            entering={FadeIn.duration(500)}
            className="flex-1 items-center justify-center gap-3 px-8"
        >
            <View className="h-16 w-16 rounded-2xl bg-muted items-center justify-center mb-2">
                <Icon
                    name="note-add"
                    size={32}
                    className="text-muted-foreground"
                />
            </View>
            <Text variant="title" className="text-center">
                No notes yet
            </Text>
            <Text variant="caption" className="text-center leading-5">
                Tap the + button to create your first note.
            </Text>
        </Animated.View>
    );
}
