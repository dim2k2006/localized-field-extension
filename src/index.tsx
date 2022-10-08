import React, { useState, useCallback, useEffect } from 'react';
import { render } from 'react-dom';
import { TextInput, FormControl, Form, GlobalStyles } from '@contentful/f36-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';

enum Locale {
  pl_PL = 'pl-PL',
  en_US = 'en-US',
  cs_CZ = 'cs-CZ',
}

type LocalizedField = {
  [key in Locale]?: string;
};

interface AppProps {
  sdk: FieldExtensionSDK;
}

interface AppProps {
  sdk: FieldExtensionSDK;
}

const App: React.FC<AppProps> = ({ sdk }) => {
  const sdkValue = sdk.field.getValue();
  const initialValue = sdkValue ? sdkValue : {};

  const [value, setValue] = useState<LocalizedField>(initialValue);

  const onSave = useCallback(
    (newValue: LocalizedField) => {
      sdk.field.setValue(newValue);

      setValue(newValue);
    },
    [sdk.field]
  );

  const onChange = useCallback(
    (value: LocalizedField) => {
      onSave(value);
    },
    [onSave]
  );

  useEffect(() => {
    sdk.window.startAutoResizer();

    return () => {
      sdk.window.stopAutoResizer();
    };
  }, [sdk.window]);

  useEffect(() => {
    const detachValueChangeHandler = sdk.field.onValueChanged((newValue: LocalizedField = {}) => {
      setValue(newValue);
    });

    return () => detachValueChangeHandler();
  }, [onSave, sdk.field]);

  return (
    <Form>
      {Object.values(Locale).map((localeValue) => {
        const locale = localeValue as Locale;

        return (
          <FormControl key={locale}>
            <FormControl.Label>{locale}</FormControl.Label>

            <TextInput
              value={value[locale]}
              onChange={(event) => onChange({ ...value, [locale]: event.target.value })}
            />
          </FormControl>
        );
      })}
    </Form>
  );
};

init((sdk) => {
  render(
    <>
      <GlobalStyles />

      <App sdk={sdk as FieldExtensionSDK} />
    </>,
    document.getElementById('root')
  );
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
