import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Modal } from '@fluentui/react/lib/Modal';
import { Nav } from '@fluentui/react/lib/Nav';
import { ResponsiveMode } from '@fluentui/react/';
import { Stack, StackItem } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import ActionButton from '../ActionButton/ActionButton';
import Button from '../Button/Button';
import Link from '../Link/Link';
import { UxpColors } from '../_helpers/uxpcolorutils';
import { UxpMenuUtils } from '../_helpers/uxpmenuutils';
import { UxpNumberParser } from '../_helpers/uxpnumberparser';



//Default nav items to populate the control with.
//Leave these left aligned as they show up in UXPin exactly as-is. 
const defaultNavItems = `1 Details | Details
2 Collaborators | Identify Collaborators
3 Review | Review`;

const defaultPanelPadding = 24;
const headingBgColor = "#deecf9";     //themeLighter
const headingTextColor = '#000000';   //black
const navBgColor = '#f3f2f1';         //neutralLighter
const navBorderColor = '#d2d0ce';     //neutralQuaternary
const defaultTextColor = '#000000';    //black
const panelHeadingTextVariant = 'xLarge';
const defaultNextLabel = "Next";

const stackStretch = 'stretch';
const stackTop = 'start';
const stackCenter = 'center';

const wizardStackItemStyles = {
    root: {
        background: '#ffffff',
        minWidth: '80vw',
        minHeight: '80vh',
    },
};
const bodyPanelStyle = {
    root: {
        background: '#ffffff',
    },
};
const navStyles = {
    root: {
        width: 211,
        minHeight: '200',
        height: 'auto',
        paddingTop: 24,
    },
};


class Wizard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: [],
            navSteps: [],
            open: false,
            index: 1, //1-based
        }
    }

    set() {

        let stepList = this._getStepList();
        let navItems = this._getStepNavItems(stepList);

        console.log("navItems: " + JSON.stringify(navItems));

        //Normalize the Selected Index
        let index = this.props.selectedIndex < 1 ? 1 :
            this.props.selectedIndex > stepList.length ? stepList.length :
                this.props.selectedIndex;

        this.setState(
            {
                open: this.props.show,
                index: index,
                steps: stepList,
                navSteps: navItems,
            }
        )
    }

    componentDidMount() {
        this.set();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedIndex !== this.props.selectedIndex ||
            prevProps.steps !== this.props.steps ||
            prevProps.selectedIndex !== this.props.selectedIndex ||
            prevProps.show !== this.props.show) {
            this.set();
        }
    }

    _getStepList() {
        let stepList = [];

        if (this.props.steps) {
            let items = this.props.steps.match(/[^\r\n]+/g);

            if (items && items.length) {
                for (var i = 0; i < items.length; i++) {
                    let item = items[i];

                    let stepInfo = this._parseStepInfo(item);

                    if (stepInfo)
                        stepList.push(stepInfo);
                }
            }
        }

        return stepList;
    }

    _parseStepInfo(rawStr) {
        if (rawStr && rawStr.length) {

            //If the user entered it...
            let sData = rawStr.split("|");

            //Parse left side: display name
            if (sData && sData.length) {

                let left = sData[0].trim();

                //This is the optional Panel Heading for the step. 
                let right = sData[1] ? sData[1].trim() : left;

                let stepInfo = {
                    step: left,
                    heading: right,
                };
                return stepInfo;
            }
        }

        //If we made it this far, there were errors.
        return undefined;
    }

    _getStepNavItems(stepParams) {
        if (!stepParams || stepParams.length < 1)
            return undefined;

        let navItems = [];

        var i;
        for (i = 0; i < stepParams.length; i++) {
            let stepInfo = stepParams[i];
            if (stepInfo.step) {
                let navParams = UxpMenuUtils.getNavItemProps(i, stepInfo.step, undefined, undefined, false);
                // let navParams = this._getNavItemProps(i, stepInfo.step, undefined, false);

                if (navParams)
                    navItems.push(navParams);
            }
        }

        return navItems;
    }

    _getNavItemProps(index, text, iconName, disabled) {
        let navProps = {
            key: index + 1,
            name: text ? text : '',
            icon: iconName ? iconName : '',
            disabled: disabled,
        }
        return navProps;
    }

    _setNewIndex(index) {
        //Our state is 1 based
        let newIndex = index < 1 ? 1 :
            index > this.state.steps.length ? this.state.steps.length :
                index;

        if (newIndex !== this.state.index) {
            this.setState(
                { index: newIndex }
            )
        }
    }

    _onNavItemClick(item) {
        if (!item)
            return;

        //The item's key is already its 1-based index.
        let index = item.key;
        console.log("On nav item clicked: " + index);
        this._setNewIndex(index);
    }

    _onNextClick() {
        console.log("On next clicked");

        //If it's not the last item
        let index = this.state.index + 1;
        this._setNewIndex(index);
    }

    _onBackClick() {
        console.log("On back clicked");

        let index = this.state.index - 1;
        this._setNewIndex(index);
    }

    _onCancelClick() {
        console.log("On cancel clicked");
    }

    _onHelpClick() {
        console.log("On help clicked");
    }

    _onDismissClicked() {
        this.dismissControl(true);
    }

    dismissControl(notifyUXPin) {
        //Notify UXPin that the Close icon has been clicked on.
        if (notifyUXPin && this.props.dismiss) {
            this.props.dismiss();
        }

        //Set the control to not open to dismiss it.
        //We have to set the state and prop twice.

        this.setState(
            { open: false }
        )

        this.props.show = false;
    }

    render() {
        /** Misc Dynamic Constants */
        const headerStackItemStyles = {
            root: {
                background: headingBgColor,
            },
        };
        const bodyStackStyles = {
            root: {
                background: navBgColor,
            },
        };
        const navStackStyles = {
            root: {
                borderRight: '1px solid ' + navBorderColor,
            },
        };

        const footerStackItemStyles = {
            root: {
                borderTop: '1px dashed ' + navBorderColor,
            },
        };

        const wizardHeadingTextStyles = {
            root: {
                color: headingTextColor,
            },
        }
        const panelHeadingTextStyles = {
            root: {
                color: defaultTextColor,
            },
        }

        /** Wizard Heading */
        var wizardHeading = '';
        if (this.props.title) {
            wizardHeading = (
                <Text
                    styles={wizardHeadingTextStyles}
                    variant={panelHeadingTextVariant}
                    block>
                    {this.props.title?.trim()}
                </Text>
            );
        }

        console.log("Render. index: " + this.state.index);

        let backBtn = this.state.index < 2 ? '' : (<Button
            primary={false}
            text={"Back"}
            onClick={() => this._onBackClick()}
        />);

        let nextBtnLabel = this.state.index === this.state.navSteps.length ? this.props.submitLabel : defaultNextLabel;

        console.log("nextBtnLabel: " + nextBtnLabel);

        var panelHeading = undefined;
        if (this.state.index <= this.state.steps.length) {
            let stepInfo = this.state.steps[this.state.index - 1];

            panelHeading = (
                <Text
                    styles={panelHeadingTextStyles}
                    variant={panelHeadingTextVariant}>
                    {stepInfo.heading}
                </Text>
            );
        }

        var selectedNavKey = "";
        if (this.state.index <= this.state.navSteps.length) {
            let item = this.state.navSteps[this.state.index - 1];
            if (item)
                selectedNavKey = item.key;
        }
        let navGroupParams = [
            { links: this.state.navSteps }
        ];

        return (

            <div>
                <div  //A visual aid for the designer to see in UXPin
                    style={{
                        width: '100px',
                        height: '100px',
                        color: "white",
                        textAlign: "center",
                        verticalAlign: "middle",
                        background: '#d29200',
                        borderRadius: 10
                    }}><br /><em><strong>Wizard:</strong></em><br />Move this marker offscreen</div>

                <Modal
                    isOpen={this.state.open}
                    responsiveMode={ResponsiveMode.xLarge}
                    isDarkOverlay={true}
                    isBlocking={true}
                    dragOptions={undefined}
                    onDismiss={() => { this._onDismissClicked() }}
                >

                    {/* Modal Display Area */}
                    <Stack
                        horizontal={false}
                        horizontalAlign={stackStretch}
                        styles={wizardStackItemStyles}>

                        {/* Header and Close button */}
                        <StackItem>
                            <Stack
                                horizontal={true}
                                verticalAlign={stackCenter}
                                horizontalAlign={stackTop}
                                styles={headerStackItemStyles}
                                tokens={{
                                    padding: 12,
                                    childrenGap: 12,
                                }}>

                                {/* Left Side Text */}
                                <StackItem
                                    tokens={{
                                        padding: 0,
                                        childrenGap: 6,
                                    }}
                                    horizontalAlign={stackTop}
                                    verticalAlign={stackTop}
                                    grow={1}
                                >
                                    {wizardHeading}
                                </StackItem>

                                <StackItem>
                                    <ActionButton
                                        iconName={"ChromeClose"}
                                        tooltip={''}
                                        text={''}
                                        onClick={() => this._onDismissClicked()}
                                    />
                                </StackItem>
                            </Stack>
                        </StackItem>

                        {/* Middle Section: Nav + Body */}

                        <Stack
                            styles={bodyStackStyles}
                            horizontal={true}
                            grow={true}
                            horizontalAlign={stackStretch}
                            tokens={{
                                padding: 0,
                                childrenGap: 0,
                            }}>

                            {/* Nav: Display for the Steps */}
                            <StackItem
                                styles={navStackStyles}
                                grow={false}
                                verticalFill={true}>
                                <Stack
                                    horizontalAlign={stackStretch}
                                    grow={true}
                                >
                                    <>
                                        {this.state.navSteps.length > 0 ?
                                            <Nav
                                                {...this.props}
                                                styles={navStyles}
                                                selectedKey={selectedNavKey}
                                                groups={navGroupParams}
                                                onLinkClick={(evt, item) => { this._onNavItemClick(item) }}
                                            />
                                            : <div> </div>}
                                    </>
                                </Stack>
                            </StackItem>

                            {/* Body Section - Right Side */}
                            <StackItem
                                styles={bodyPanelStyle}
                                horizontal={true}
                                horizontalAlign={stackStretch}
                                grow={true}
                            >
                                <Stack

                                    tokens={{
                                        childrenGap: 24,
                                        padding: 24,
                                    }}
                                    horizontal={false}
                                    grow={true}>

                                    <StackItem
                                        horizontalAlign={stackStretch}>
                                        {panelHeading}
                                    </StackItem>

                                    <StackItem>
                                        {/* Children Area for each panel */}
                                        <Stack
                                            tokens={{
                                                childrenGap: 12,
                                                padding: 0,
                                            }}
                                            horizontalAlign={stackStretch}
                                            verticalAlign={stackTop}
                                            verticalFill={true}
                                        >
                                            {"Hello!"}
                                        </Stack>
                                    </StackItem>
                                </Stack>
                            </StackItem>
                        </Stack>

                        {/* Footer Button Area */}
                        <Stack
                            horizontal={true}
                            verticalAlign={stackCenter}
                            horizontalAlign={stackStretch}
                            styles={footerStackItemStyles}
                            tokens={{
                                padding: 12,
                                childrenGap: 24,
                            }}>

                            {/* Left Side Help Button */}
                            <StackItem
                                tokens={{
                                    padding: 0,
                                    childrenGap: 6,
                                }}
                                horizontalAlign={stackTop}
                                verticalAlign={stackCenter}
                                grow={3}
                            >
                                <ActionButton
                                    iconName={"info"}
                                    text={''}
                                    tooltip={'Help'}
                                    onClick={() => this._onHelpClick()}
                                />
                            </StackItem>

                            <Stack
                                tokens={{
                                    padding: 0,
                                    childrenGap: 24,
                                }}
                                horizontal={true}
                                verticalAlign={stackCenter}
                            >
                                <Link
                                    value={"Cancel"}
                                    href={''}
                                    onClick={() => this._onCancelClick()}
                                />
                                {backBtn}
                                <Button
                                    primary={true}
                                    text={nextBtnLabel}
                                    onClick={() => this._onNextClick()}
                                />
                            </Stack>

                        </Stack>

                    </Stack>
                </Modal>
            </div>
        )
    }
}


/** 
 * Set up the properties to be available in the UXPin property inspector. 
 */
Wizard.propTypes = {

    /**
     * Don't show this prop in the UXPin Editor. 
     * @uxpinignoreprop 
     * @uxpindescription Contents for the main body of the control.  
     * @uxpinpropname Right Contents
     */
    children: PropTypes.node,

    /**
    * @uxpindescription Whether to display the Wizard 
    */
    show: PropTypes.bool,

    /**
     * @uxpindescription The text to be displayed in the header of the control 
     * @uxpinpropname Title
     */
    title: PropTypes.string,

    /**
     * @uxpindescription The 1-based index value of the Steps Navigation control to be shown as selected by default. 
     * @uxpinpropname Index
     */
    selectedIndex: PropTypes.number,

    /**
     * @uxpindescription The list of steps in the nav. Put each item on a separate line.
     * @uxpinpropname Items
     * @uxpincontroltype codeeditor
     */
    steps: PropTypes.string,

    /**
     * @uxpindescription The text to be displayed in the Submit button on the final step.
     * @uxpinpropname Submit Label
     */
    submitLabel: PropTypes.string,

    /**
    * @uxpindescription Whether to hide the Wizard immediately when the user hits the Cancel or Close controls. If False, then the Wizard must be closed by manually setting the Show prop to false. 
    * @uxpinpropname Hide on Dismiss
    */
    dismissOnCancel: PropTypes.bool,

    /**
     * @uxpindescription Fires when the Submit Button is clicked.
     * @uxpinpropname Submit Clicked
     */
    onSubmit: PropTypes.func,

    /**
     * @uxpindescription Fires when the Help Button is clicked.
     * @uxpinpropname Help Clicked
     */
    onHelp: PropTypes.func,

    /**
     * @uxpindescription Fires when the Wizard is dismissed by the Close or Cancel buttons.
     * @uxpinpropname Dismissed
     */
    dismiss: PropTypes.func,
};


/**
 * Set the default values for this control in the UXPin Editor.
 */
Wizard.defaultProps = {
    show: false,
    title: "Wizard",
    steps: defaultNavItems,
    selectedIndex: 1,
    dismissOnCancel: true,
    submitLabel: "Submit",
};


export { Wizard as default };