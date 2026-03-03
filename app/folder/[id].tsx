import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { useNotes } from "@/hooks/use-notes";
import { useFolders } from "@/hooks/use-folders";
import { BentoGrid } from "@/components/notes/bento-grid";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { toPreview } from "@/lib/utils";
import { COLORS } from "@/lib/constants";
import { useTheme } from "@/hooks/use-theme";
import type { Folder } from "@/lib/types";

export default function FolderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const colors = COLORS[resolvedTheme];
    const { folders } = useFolders();
    const { notes, isLoading, refresh } = useNotes(id);
    const [folder, setFolder] = useState<Folder | null>(null);

    useEffect(() => {
        const found = folders.find((f) => f.id === id);
        if (found) setFolder(found);
    }, [id, folders]);

    const previews = notes.map(toPreview);

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen
                options={{
                    headerBackTitle: "BACK",
                    headerRight: () => (
                        <Icon
                            name="search"
                            size={22}
                            color={colors.foreground}
                        />
                    ),
                }}
            />

            {/* Folder header */}
            <Animated.View
                entering={FadeIn.duration(400)}
                className="px-5 pb-3"
            >
                <View className="flex-row items-start justify-between">
                    <View className="flex-1 mr-4">
                        <Text variant="largeHeading">
                            {folder?.name ?? "Folder"}
                        </Text>
                        <Text variant="caption" className="mt-0.5">
                            {notes.length} notes
                        </Text>
                    </View>
                    <Button
                        label="＋"
                        variant="outline"
                        size="icon"
                        onPress={() =>
                            router.push({
                                pathname: "/note/new",
                                params: { folderId: id },
                            })
                        }
                    />
                </View>
            </Animated.View>

            {/* Bento grid */}
            <BentoGrid
                notes={previews}
                onNotePress={(noteId) => router.push(`/note/${noteId}`)}
                onRefresh={refresh}
                refreshing={isLoading}
            />
        </View>
    );
}
