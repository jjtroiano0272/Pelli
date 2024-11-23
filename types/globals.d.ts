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

type Client = {
  id: number;
  created_at: string; // TODO Technically a date-time...looks like "2024-11-19T22:49:32.699029+00:00"
  first_name: string;
  last_name: string;
  profile_image: string;
};
