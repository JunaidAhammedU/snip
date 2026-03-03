import { TextInput, type TextInputProps } from "react-native";

interface Props extends TextInputProps {
    variant?: "default" | "ghost";
}

const variantClasses = {
    default:
        "bg-card border border-border rounded-lg px-4 py-3 text-foreground",
    ghost: "bg-transparent text-foreground px-0 py-2",
};

export function Input({
    variant = "default",
    className = "",
    style,
    ...props
}: Props) {
    return (
        <TextInput
            className={`text-base ${variantClasses[variant]} ${className}`}
            placeholderClassName="text-muted-foreground"
            style={[{ fontFamily: "Lato_400Regular" }, style]}
            {...props}
        />
    );
}
