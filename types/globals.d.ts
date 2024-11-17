// globals.d.ts
interface MyCustomType {
  id: string;
  name: string;
  age: number;
}

type AnotherType = {
  propertyOne: string;
  propertyTwo: boolean;
};

type PostData = {
  file:
    | ImagePicker.ImagePickerAsset
    | ImagePicker.ImagePickerAsset[]
    | null
    | undefined;
  body: string;
  client_name: string;
  formula_info: {
    formula_type: string;
    formula_description: string;
  };
  userId: any;
};
