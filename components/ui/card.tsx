import { Pressable, View, type PressableProps } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { lightTap } from "@/lib/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends PressableProps {
    children: React.ReactNode;
    className?: string;
    haptic?: boolean;
}

export function Card({
    children,
    className = "",
    haptic = true,
    onPress,
    ...props
}: Props) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            style={animatedStyle}
            className={`bg-card rounded-2xl border border-border p-4 ${className}`}
            onPressIn={() => {
                scale.value = withSpring(0.97, {
                    damping: 15,
                    stiffness: 400,
                });
            }}
            onPressOut={() => {
                scale.value = withSpring(1, { damping: 15, stiffness: 400 });
            }}
            onPress={(e) => {
                if (haptic) lightTap();
                onPress?.(e);
            }}
            {...props}
        >
            {children}
        </AnimatedPressable>
    );
}

export function CardStatic({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <View
            className={`bg-card rounded-2xl border border-border p-4 ${className}`}
        >
            {children}
        </View>
    );
}
