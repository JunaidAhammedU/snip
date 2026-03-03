import { Text as RNText, type TextProps } from "react-native";

interface Props extends TextProps {
    variant?:
    | "body"
    | "heading"
    | "title"
    | "caption"
    | "label"
    | "largeHeading"
    | "number";
}

const variantClasses: Record<NonNullable<Props["variant"]>, string> = {
    body: "text-base text-foreground",
    heading: "text-2xl font-bold text-foreground tracking-tight",
    largeHeading: "text-3xl font-extrabold text-foreground tracking-tight",
    title: "text-lg font-semibold text-foreground",
    caption: "text-sm text-muted-foreground",
    label: "text-sm font-medium text-foreground",
    number: "text-xs text-muted-foreground font-medium",
};

const variantFonts: Record<NonNullable<Props["variant"]>, string> = {
    body: "Lato_400Regular",
    heading: "Lato_700Bold",
    largeHeading: "Lato_900Black",
    title: "Lato_700Bold",
    caption: "Lato_400Regular",
    label: "Lato_700Bold",
    number: "Lato_400Regular",
};

export function Text({ variant = "body", className = "", style, ...props }: Props) {
    return (
        <RNText
            className={`${variantClasses[variant]} ${className}`}
            style={[{ fontFamily: variantFonts[variant] }, style]}
            {...props}
        />
    );
}
