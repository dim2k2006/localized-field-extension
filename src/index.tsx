import * as React from 'react';
import { render } from 'react-dom';
import { TextInput } from '@contentful/f36-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import './index.css';

enum Locale {
  pl_PL = 'pl-PL',
  en_US = 'en-US',
}

interface AppProps {
  sdk: FieldExtensionSDK;
}

interface AppState {
  value?: string;
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue() || '',
    };
  }

  detachExternalChangeHandler: Function | null = null;

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = (value: string) => {
    this.setState({ value });
  };

  onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.setState({ value });
    if (value) {
      await this.props.sdk.field.setValue(value);
    } else {
      await this.props.sdk.field.removeValue();
    }
  };

  render() {
    return <div>Here goes something</div>;
  }
}

init((sdk) => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
