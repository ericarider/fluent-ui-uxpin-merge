import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ChoiceGroup as FChoiceGroup } from '@fluentui/react/lib/ChoiceGroup';
import { UxpMenuUtils } from '../_helpers/uxpmenuutils';



const choiceGroupHorizontalStyles = {
  label: {
    display: "inline",
    content: "\a"
  },
  flexContainer: {
    columnGap: "1em",
    display: "inline-flex",
    flexDirection: "row",
    flexWrap: "wrap"
  }
};


class ChoiceGroup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      _index: 0,
      items: []
    }
  }

  set() {
    var menuItems = UxpMenuUtils.parseSimpleListText(this.props.items, this.props.tiled, this.props.disabled);

    this.setState({
      _items: menuItems,
      _index: this.props.selectedIndex,
    });
  }

  componentDidMount() {
    this.set();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.items !== this.props.items ||
      prevProps.tiled !== this.props.tiled ||
      prevProps.selectedIndex !== this.props.selectedIndex) {
      this.set();
    }
  }

  _onChoiceChange(option) {
    //Get the value. Add 1 because it's stored as a 1-based index to be more user friendly.
    const i = option.key + 1;

    //Set the state with the updated index value. 
    this.setState(
      { _index: i }
    )

    //Raise this event to UXPin. 
    if (this.props.onChoiceChange) {
      this.props.onChoiceChange(i);
    }
  }

  render() {

    //Subtract 1 because it's stored as a 1-based index to be more user friendly.
    const selectedKey = this.state._index - 1;

    const hstyle = this.props.horizontalRB ? choiceGroupHorizontalStyles : '';

    return (

      <FChoiceGroup
        {...this.props}
        options={this.state._items}
        selectedKey={selectedKey}
        styles={hstyle}
        onChange={(e, o) => { this._onChoiceChange(o); }}
      />

    );
  }
}


/** 
 * Set up the properties to be available in the UXPin property inspector. 
 */
ChoiceGroup.propTypes = {

  /**
   * @uxpindescription The label for the options
   * @uxpinpropname Label
   * @uxpincontroltype textfield(2)
   * */
  label: PropTypes.string,

  /**
  * @uxpindescription The 1-based index value of the default item to be shown as selected (Optional). This prop's live value is available for scripting.
  * @uxpinbind onChoiceChange
  * @uxpinpropname * Index
   * */
  selectedIndex: PropTypes.number,

  /**
  * @uxpindescription The list of options. Put each option on a separate line. Enclose an item in quotes to include a comma within it.  For tiled choices, check the Tiled property and add an icon(IconName) at the start of each line.
  * @uxpinpropname Items
  * @uxpincontroltype codeeditor
   * */
  items: PropTypes.string,

  /**
   * @uxpindescription To display the choices as icon tiles
   * @uxpinpropname Tiled
   * */
  tiled: PropTypes.bool,

  /**
   * @uxpindescription To display the radio buttons horizontally
   * @uxpinpropname Horizontal Radio Buttons
   * */
  horizontalRB: PropTypes.bool,


  /**
   * @uxpindescription To display the 'required' flag on the label
   * @uxpinpropname Required
   * */
  required: PropTypes.bool,

  /**
   * @uxpindescription Whether to show the control as disabled
   * @uxpinpropname Disabled
   * */
  disabled: PropTypes.bool,

  /**
   * @uxpindescription Fires when the selected index value changes.
   * @uxpinpropname * Index Changed
   * */
  onChoiceChange: PropTypes.func
};

/**
 * Set the default values for this control in the UXPin Editor.
 */
ChoiceGroup.defaultProps = {
  label: '',
  items: '',
  selectedIndex: 0,
  required: false,
  tiled: false,
  horizontalRB: false,
};


export { ChoiceGroup as default };
