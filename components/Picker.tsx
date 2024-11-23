import * as DropdownMenu from "zeego/dropdown-menu";
import { View, Text } from "react-native";
import Icon from "@/assets/icons";
import { withTheme } from "react-native-paper";

export type Props = {
  items: Array<{
    key: string;
    title: string;
    icon: string;
    iconAndroid?: string;
  }>;
  onSelect: (key: string) => void;
};

const Picker = ({ items, onSelect }: Props) => {
  return (
    // >> A
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Icon name="user" size={26} strokeWidth={1.6} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {/* <DropdownMenu.Label>Label</DropdownMenu.Label> */}

        <DropdownMenu.Item key="42">
          <DropdownMenu.ItemTitle>My item</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>

    // >> B
    // <DropdownMenu.Root>
    //   <DropdownMenu.Trigger>...</DropdownMenu.Trigger>

    //   <DropdownMenu.Content>
    //     <DropdownMenu.Label>Label</DropdownMenu.Label>

    //     <DropdownMenu.Item key='fernando rojo'>
    //       <DropdownMenu.ItemTitle>Fernando Rojo</DropdownMenu.ItemTitle>
    //     </DropdownMenu.Item>
    //   </DropdownMenu.Content>
    // </DropdownMenu.Root>
  );
};

export default Picker;
