import { Pressable, type PressableProps } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { Text } from "./text";
import { lightTap } from "@/lib/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends PressableProps {
    label: string;
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
    size?: "sm" | "md" | "lg" | "icon";
    haptic?: boolean;
}

const variantClasses = {
    primary: "bg-primary",
    secondary: "bg-accent",
    ghost: "bg-transparent",
    destructive: "bg-destructive",
    outline: "bg-transparent border border-border",
};

const textClasses = {
    primary: "text-primary-foreground",
    secondary: "text-accent-foreground",
    ghost: "text-foreground",
    destructive: "text-destructive-foreground",
    outline: "text-foreground",
};

const sizeClasses = {
    sm: "px-3 py-1.5 rounded-lg",
    md: "px-4 py-2.5 rounded-xl",
    lg: "px-6 py-3.5 rounded-2xl",
    icon: "h-12 w-12 rounded-xl",
};

export function Button({
    label,
    variant = "primary",
    size = "md",
    className = "",
    disabled,
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
            className={`items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? "opacity-40" : ""} ${className}`}
            disabled={disabled}
            onPressIn={() => {
                scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
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
            <Text
                variant="label"
                className={`${textClasses[variant]} ${size === "icon" ? "text-xl" : ""}`}
            >
                {label}
            </Text>
        </AnimatedPressable>
    );
}
