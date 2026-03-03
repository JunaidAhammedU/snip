import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ComponentProps } from "react";

type IconName = ComponentProps<typeof MaterialIcons>["name"];

interface Props {
    name: IconName;
    size?: number;
    className?: string;
    color?: string;
}

export function Icon({ name, size = 24, color, className }: Props) {
    return (
        <MaterialIcons
            name={name}
            size={size}
            color={color}
            className={className}
        />
    );
}
