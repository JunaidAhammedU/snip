import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";

export function FolderEmpty() {
    return (
        <View className="flex-1 items-center justify-center gap-3 px-8">
            <Icon
                name="folder-open"
                size={48}
                className="text-muted-foreground"
            />
            <Text variant="title" className="text-center">
                No folders yet
            </Text>
            <Text variant="caption" className="text-center">
                Tap the + button to create your first folder.
            </Text>
        </View>
    );
}
