import { FlatList } from "react-native";
import { FolderRow } from "./folder-row";
import { FolderEmpty } from "./folder-empty";
import type { FolderWithCount } from "@/lib/types";

interface Props {
    folders: FolderWithCount[];
    onFolderPress: (id: string) => void;
    onRefresh?: () => void;
    refreshing?: boolean;
}

export function FolderList({
    folders,
    onFolderPress,
    onRefresh,
    refreshing,
}: Props) {
    return (
        <FlatList
            data={folders}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
                <FolderRow
                    folder={item}
                    index={index}
                    onPress={onFolderPress}
                />
            )}
            contentContainerClassName="px-5 pb-24"
            contentContainerStyle={
                folders.length === 0 ? { flex: 1 } : undefined
            }
            ListEmptyComponent={<FolderEmpty />}
            onRefresh={onRefresh}
            refreshing={refreshing}
            showsVerticalScrollIndicator={false}
        />
    );
}
