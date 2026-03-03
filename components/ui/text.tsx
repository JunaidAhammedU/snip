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

export function Text({ variant = "body", className = "", ...props }: Props) {
    return (
        <RNText className={`${variantClasses[variant]} ${className}`} {...props} />
    );
}
