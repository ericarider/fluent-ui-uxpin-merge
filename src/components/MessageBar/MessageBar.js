import * as React from 'react';
import * as PropTypes from 'prop-types';
import { MessageBar as FMessageBar, MessageBarButton, MessageBarType } from '@fluentui/react';
import * as UXPinParser from '../_helpers/UXPinParser';

const linkTarget = 'uxpin_proto_';

class MessageBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
    };
  }

  set() {
    let message = this._getMessageText();

    this.setState({ message: message });
  }

  componentDidMount() {
    this.set();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.message !== this.props.message) {
      this.set();
    }
  }

  _getMessageText() {
    let elements;
    let parsedOutput = UXPinParser.parse(this.props.message);
    // console.log("Text parsedOutput in JSON: " + JSON.stringify(parsedOutput));

    return parsedOutput.map((item) => {
      // If not type compound, return the single element
      if (item.type !== 'compound') {
        return this._parseItem(item);
      } else {
        // If type compound, map the item values
        elements = item.value.map((subItem) => {
          // Second map of parsedOutput.value to seperate each object of links, icons, and text
          return this._parseItem(subItem);
        });
        return elements;
      }
    });
  }

  _parseItem(item) {
    if (item) {
      const key = _.uniqueId('text_');
      return item.type === 'link'
        ? this._getLinkElement(key, item?.text, item?.href)
        : this._getTextElement(key, item?.text);
    }
  }

  _getTextElement(key, text) {
    return <span key={key}> {text} </span>;
  }

  _getLinkElement(key, text, href) {
    return (
      <a key={key} href={href ? href : ''} target={href ? linkTarget : ''}>
        {text}
      </a>
    );
  }

  _onDismiss() {
    if (this.props.onDismissClicked) {
      this.props.onDismissClicked(true);
    }
  }

  _onClickButton1() {
    if (this.props.onClick1) {
      this.props.onClick1(1);
    }
  }

  _onClickButton2() {
    if (this.props.onClick2) {
      this.props.onClick2(2);
    }
  }

  render() {
    let truncated = !this.isMultiline;
    let message = this.state.message;

    //Adding ANY buttons to the control appears to cause fatal errors.
    var btn1 = '';
    var btn2 = '';
    var btnActions = '';
    var hasBtns = false;

    if (this.props.button1Text) {
      btn1 = (
        <MessageBarButton
          primary
          style={{ fontSize: '10px', fontWeight: 'lighter' }}
          onClick={() => {
            this._onClickButton1();
          }}
        >
          {this.props.button1Text}
        </MessageBarButton>
      );
      hasBtns = true;
    }

    if (this.props.button2Text) {
      btn2 = (
        <MessageBarButton
          style={{ fontSize: '10px', fontWeight: 'lighter' }}
          onClick={() => {
            this._onClickButton2();
          }}
        >
          {this.props.button2Text}
        </MessageBarButton>
      );
      hasBtns = true;
    }

    if (hasBtns) {
      btnActions = (
        <div>
          {btn2}
          {btn1}
        </div>
      );
    }

    var dismissProps = '';
    if (this.props.showDismissButton) {
      dismissProps = {
        onDismiss: () => {
          this._onDismiss();
        },
      };
    }

    return (
      <FMessageBar
        {...this.props}
        truncated={truncated}
        messageBarType={MessageBarType[this.props.messageBarType]}
        {...dismissProps}
        actions={btnActions}
      >
        <div>{message}</div>
      </FMessageBar>
    );
  }
}

/**
 * Set up the properties to be available in the UXPin property inspector.
 */
MessageBar.propTypes = {
  /**
   * @uxpindescription The control's message.
   * Supports the special syntax for links and icons.
   * Example:
   * link(Click here | href )
   * @uxpincontroltype textfield(10)
   */
  message: PropTypes.string,

  /**
   * @uxpindescription Reflect the control's role in the UI with its visual style
   * @uxpinpropname Role
   */
  messageBarType: PropTypes.oneOf(['info', 'success', 'warning', 'severeWarning', 'error', 'remove', 'blocked']),

  /**
   * @uxpindescription Whether to allow the text to wrap across multiple lines
   * @uxpinpropname Multiline
   */
  isMultiline: PropTypes.bool,

  /**
   * @uxpindescription Whether to show the dismiss button
   * @uxpinpropname Dismiss Button
   */
  showDismissButton: PropTypes.bool,

  /**
   * @uxpindescription The text to display on the Primary Button (Optional)
   * @uxpinpropname Primary Button Text
   */
  button1Text: PropTypes.string,

  /**
   * @uxpindescription The text to display on the Secondary Button (Optional)
   * @uxpinpropname Secondary Button Text
   */
  button2Text: PropTypes.string,

  /**
   * @uxpindescription Fires when the Close button is clicked on
   * @uxpinpropname Dismiss
   */
  onDismissClicked: PropTypes.func,

  /**
   * @uxpindescription Fires when the Primary Button is clicked on
   * @uxpinpropname Primary Click
   */
  onClick1: PropTypes.func,

  /**
   * @uxpindescription Fires when the Secondary Button is clicked on
   * @uxpinpropname Secondary Click
   */
  onClick2: PropTypes.func,
};

/**
 * Set the default values for this control in the UXPin Editor.
 */
MessageBar.defaultProps = {
  message: 'This is a Basic Message Bar. link(Learn More... | google.com)',
  messageBarType: 'info',
  isMultiline: true,
  button1Text: 'Yes',
  button2Text: 'No',
  showDismissButton: true,
};

export { MessageBar as default };
