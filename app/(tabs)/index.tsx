import { useCallback, useEffect, useState } from "react";
import { View, Alert, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { useFolders } from "@/hooks/use-folders";
import { FolderList } from "@/components/folders/folder-list";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/hooks/use-theme";
import type { FolderWithCount } from "@/lib/types";
import { COLORS } from "@/lib/constants";
import { mediumTap } from "@/lib/haptics";

export default function FoldersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resolvedTheme } = useTheme();
  const colors = COLORS[resolvedTheme];
  const { folders, isLoading, refresh, addFolder, getFoldersWithCounts } =
    useFolders();
  const [foldersWithCounts, setFoldersWithCounts] = useState<
    FolderWithCount[]
  >([]);

  const loadCounts = useCallback(async () => {
    const data = await getFoldersWithCounts();
    setFoldersWithCounts(data);
  }, [getFoldersWithCounts]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts, folders]);

  const handleRefresh = async () => {
    await refresh();
    await loadCounts();
  };

  const handleAddFolder = () => {
    Alert.prompt(
      "New Folder",
      "Enter a name for this folder",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          onPress: async (name?: string) => {
            if (name?.trim()) {
              mediumTap();
              await addFolder(name.trim());
            }
          },
        },
      ],
      "plain-text"
    );
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(500)}
        className="px-5 pt-4 pb-2"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <Icon
              name="menu"
              size={22}
              color={colors.foreground}
            />
            <Text variant="label">MENU</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <Icon
              name="notifications-none"
              size={22}
              color={colors.foreground}
            />
            <Icon
              name="search"
              size={22}
              color={colors.foreground}
            />
          </View>
        </View>

        <View className="flex-row items-start justify-between">
          <View>
            <Text variant="largeHeading">All Folders</Text>
            <View className="flex-row items-center gap-1.5 mt-1">
              <Text variant="caption">This Month</Text>
              <Icon
                name="calendar-today"
                size={14}
                color={colors.mutedForeground}
              />
            </View>
          </View>
          <Button
            label="＋"
            variant="outline"
            size="icon"
            onPress={handleAddFolder}
          />
        </View>
      </Animated.View>

      {/* Folder list */}
      <FolderList
        folders={foldersWithCounts}
        onFolderPress={(id) => router.push(`/folder/${id}`)}
        onRefresh={handleRefresh}
        refreshing={isLoading}
      />
    </View>
  );
}
