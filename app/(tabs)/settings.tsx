import { View, Pressable } from "react-native";
import Animated, {
    FadeIn,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/hooks/use-theme";
import { APP_NAME, COLORS } from "@/lib/constants";
import { selectionTap } from "@/lib/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const options = [
    { label: "Light", value: "light" as const, icon: "light-mode" as const },
    { label: "Dark", value: "dark" as const, icon: "dark-mode" as const },
    {
        label: "System",
        value: "system" as const,
        icon: "phone-iphone" as const,
    },
];

export default function SettingsScreen() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const colors = COLORS[resolvedTheme];

    return (
        <Animated.View
            entering={FadeIn.duration(400)}
            className="flex-1 bg-background p-5 gap-8"
        >
            <View className="gap-3">
                <Text
                    variant="caption"
                    className="px-1 uppercase tracking-widest text-xs"
                >
                    Appearance
                </Text>
                <View className="gap-2">
                    {options.map((opt) => (
                        <ThemeOption
                            key={opt.value}
                            label={opt.label}
                            icon={opt.icon}
                            isSelected={theme === opt.value}
                            colors={colors}
                            onPress={() => {
                                selectionTap();
                                setTheme(opt.value);
                            }}
                        />
                    ))}
                </View>
            </View>

            <View className="mt-auto items-center pb-8 gap-1">
                <Text className="text-base font-extrabold text-foreground tracking-tight">
                    {APP_NAME}
                </Text>
                <Text variant="caption" className="text-xs">
                    v1.0.0
                </Text>
            </View>
        </Animated.View>
    );
}

function ThemeOption({
    label,
    icon,
    isSelected,
    colors,
    onPress,
}: {
    label: string;
    icon: "light-mode" | "dark-mode" | "phone-iphone";
    isSelected: boolean;
    colors: (typeof COLORS)[keyof typeof COLORS];
    onPress: () => void;
}) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            style={animatedStyle}
            className={`flex-row items-center gap-3 p-4 rounded-2xl border ${isSelected ? "border-primary bg-accent" : "border-border bg-card"}`}
            onPressIn={() => {
                scale.value = withSpring(0.97, {
                    damping: 15,
                    stiffness: 400,
                });
            }}
            onPressOut={() => {
                scale.value = withSpring(1, { damping: 15, stiffness: 400 });
            }}
            onPress={onPress}
        >
            <Icon name={icon} size={20} color={colors.foreground} />
            <Text variant="body" className="flex-1">
                {label}
            </Text>
            {isSelected && (
                <Icon name="check" size={20} color={colors.foreground} />
            )}
        </AnimatedPressable>
    );
}
