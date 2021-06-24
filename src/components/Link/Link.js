import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Link as FLink } from '@fluentui/react/lib/Link';
import { Text } from '@fluentui/react/lib/Text';
import { UxpColors } from '../_helpers/uxpcolorutils';


class Link extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            linkColor: undefined,
            hoverColor: undefined,
            disabledColor: undefined,
            isDisabled: false,
        }
    }

    set() {
        let aColor = UxpColors.getHexFromHexOrToken(this.props.color);
        let hColor = UxpColors.getHexFromHexOrToken(this.props.hoverColor);
        let dColor = UxpColors.getHexFromHexOrToken(this.props.disabledColor);

        this.setState({
            linkColor: aColor,
            hoverColor: hColor,
            disabledColor: dColor,
            isDisabled: this.props.isDisabled,
        })
    }

    componentDidMount() {
        this.set();
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.color !== this.props.color ||
            prevProps.hoverColor !== this.props.hoverColor ||
            prevProps.disabledColor !== this.props.disabledColor ||
            prevProps.disabled !== this.props.disabled
        ) {
            this.set();
        }
    }

    _onLinkClick() {

        if (this.props.disabled)
            return;

        //Raise this event to UXPin. We'll send them the HREF value in case they can catch it.
        if (this.props.onLinkClick) {
            this.props.onLinkClick(this.props.linkHref);
        }
    }


    render() {
        const linkTarget = "_UXPin Mockup";

        let linkStyles = {
            root: {
                //color: this.state.linkColor ? this.state.linkColor : undefined,
                selectors: {
                    ':link': {
                        color: this.state.linkColor ? this.state.linkColor : undefined,
                    },
                    ':hover': {
                        color: this.state.hoverColor ? this.state.hoverColor : undefined,
                    },
                    ':disabled': {
                        color: this.state.disabledColor ? this.state.disabledColor : undefined,
                    },
                },
            },
        };

        //We assemble the Link Text style next
        let linkTextStyles = {
            root: {
                fontWeight: this.props.bold ? 'bold' : 'normal',
                fontStyle: this.props.italic ? 'italic' : 'normal',
                display: 'block',         //Required - prevents a bug
                lineHeight: 'normal',     //Required - prevents a bug,
                textAlign: this.props.align,
            }
        };


        return (
            <Text
                {...this.props}
                styles={linkTextStyles}
                variant={this.props.size}>

                <FLink
                    {...this.props}
                    disabled={this.state.isDisabled}
                    href={this.props.linkHref}
                    styles={linkStyles}
                    target={linkTarget} //Force open in a new window
                    onClick={() => { this._onLinkClick() }}
                >

                    {this.props.value}

                </FLink>
            </Text >

        );
    }
}


/** 
 * Set up the properties to be available in the UXPin property inspector. 
 */
Link.propTypes = {

    /**
     * @uxpindescription The text value to display
     * @uxpinpropname Link Text
     * @uxpincontroltype textfield(6)
     */
    value: PropTypes.string,

    /**
     * @uxpindescription A valid href value for the link itself. It should start with "http://", "https://", or "mailto:"
     * @uxpinpropname href
     * @uxpincontroltype textfield(6)
     */
    linkHref: PropTypes.string,

    /**
     * @uxpindescription To apply bold formatting
     * @uxpinpropname Bold
     */
    bold: PropTypes.bool,

    /**
     * @uxpindescription To apply italic formatting
     * @uxpinpropname Italic
     */
    italic: PropTypes.bool,

    /**
     * @uxpindescription Text alignment
     */
    align: PropTypes.oneOf(['left', 'center', 'right']),

    /**
     * @uxpindescription The display size, corresponding to a Microsoft Text 'Variant'
     * @uxpinpropname Size
     */
    size: PropTypes.oneOf([
        'tiny',
        'xSmall',
        'small',
        'smallPlus',
        'medium',
        'mediumPlus',
        'large',
        'xLarge',
        'xxLarge',
        'mega',
    ]),

    /**
     * @uxpindescription Specify a link color with a Hex or color token, such as '#ffffff'. Leave empty to allow the current theme's default value.
     * @uxpinpropname Active Color
    */
    color: PropTypes.string,

    /**
     * @uxpindescription Specify a hover color with a Hex or color token, such as '#ffffff'. Leave empty to allow the current theme's default value.
     * @uxpinpropname Hover Color
    */
    hoverColor: PropTypes.string,

    /**
     * @uxpindescription Specify a disabled link color with a Hex or color token, such as '#ffffff'. Leave empty to allow the current theme's default value.
     * @uxpinpropname Disabled Color
    */
    disabledColor: PropTypes.string,

    /**
     * @uxpindescription To disable the control
     * @uxpinpropname Disabled
     * */
    isDisabled: PropTypes.bool,

    /**
     * @uxpindescription Fires when the control is clicked on
     * @uxpinpropname Click
     */
    onLinkClick: PropTypes.func,
}


/**
 * Set the default values for this control in the UXPin Editor.
 */
Link.defaultProps = {
    value: 'UXPin.com',
    linkHref: 'https://www.uxpin.com',
    isDisabled: false,
    size: 'medium',
    bold: false,
    italic: false,
    align: 'left',
    color: '',
    hoverColor: '',
    disabledColor: '',
}


export { Link as default };