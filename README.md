## Code Conventions
API calls all follow the following format:

```
const fn = () => {
   setLoading(true);
   let res = await serviceFileFn(dataToSubmit);
   setLoading(false);

   if (res?.success) {
     setState(res?.data)
   } else {
     Alert.alert("ScreenTitle", res?.msg);
   }

   return;
}
```

Where a serviceFile is a file that runs the async code and looks like

```
export const serviceFileFn = async (arg: any) => {
  try {
    const { data, error } = await supabase
      .from("tableName")
      // any other supabase methods

    if (error) {
      return { success: false, msg: "Could not fetchrun function in service file" };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, msg: "Could not fetchrun function in service file" };
  }
};
```

## My Notes

- Everything is titled like 'Button' by default--if you want to use something like React Native's button component, import it as `import {Button as NativeButton} from 'react-native'`
