import { Alert, Keyboard, StyleSheet, Text, View } from 'react-native';
import React, { Ref } from 'react';
import { Link } from 'expo-router';
import {
  actions,
  RichEditor,
  RichToolbar,
} from 'react-native-pell-rich-editor';
import { theme } from '@/constants/theme';
import Button from './Button';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { translate } from '@/i18n';

type Props = {
  editorRef: any;
  onChange: (arg: any) => {};
};

let heightScaleFactor = 0.85;

const RichTextEditor = ({ editorRef, onChange }: Props) => {
  const paperTheme = usePaperTheme();

  return (
    <View style={{ minHeight: 285 * heightScaleFactor }}>
      <RichToolbar
        actions={[
          // actions.setStrikethrough,
          actions.setBold,
          actions.setItalic,
          actions.insertOrderedList,
          actions.blockquote,
          // actions.alignLeft,
          // actions.alignCenter,
          // actions.alignRight,
          // actions.code,
          actions.line,
          // custom ones
          actions.heading1,
          actions.heading4,

          actions.removeFormat,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }: { tintColor: string }) => (
            <Text style={{ color: tintColor, fontWeight: '800' }}>H1</Text>
          ),
          [actions.heading4]: ({ tintColor }: { tintColor: string }) => (
            <Text style={{ color: tintColor, fontWeight: '800' }}>H4</Text>
          ),
        }}
        style={[
          styles.richBar,
          {
            backgroundColor: paperTheme.colors.backdrop,
            // placeholderColor: theme.colors.gray,
          },
        ]}
        flatContainerStyle={styles.flatStyle}
        iconTint={paperTheme.colors.onBackground}
        selectedIconTint={paperTheme.colors.onBackground}
        editor={editorRef}
        disabled={false}
      />
      {/*  WARN  Toolbar has no editor. Please make sure the prop getEditor returns a ref to the editor component. */}
      <RichEditor
        ref={editorRef}
        containerStyle={[
          styles.rich,
          {
            borderColor: paperTheme.colors.backdrop,
          },
        ]}
        editorStyle={{
          color: paperTheme.colors.onBackground,
          backgroundColor: paperTheme.colors.background,
        }}
        placeholder={translate('newPostScreen:postBodyPlaceholder')}
        onChange={onChange}
        onBlur={() => editorRef.current.blurContentEditor()}
        autoCapitalize='sentences'
      />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textHeader: { fontSize: 42 },

  richBar: {
    borderTopRightRadius: theme.radius.xl,
    borderTopLeftRadius: theme.radius.xl,
  },
  rich: {
    minHeight: 240 * heightScaleFactor,
    flex: 1,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    padding: 5,
  },

  flatStyle: {
    paddingHorizontal: 8,
    gap: 3,
  },
});
