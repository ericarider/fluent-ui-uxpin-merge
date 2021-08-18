import * as UXPinParser from './UXPinParser';
import { SelectableOptionMenuItemType } from '@fluentui/react/';
import { ContextualMenuItemType } from '@fluentui/react/lib/ContextualMenu';


export const UxpMenuUtils = {

   /**
   * The preferred tag for a child menu item. 
   */
   childTag: "*",

   /**
   * The preferred divider string for a menu: 'divider' 
   */
   dividerText1: "divider",

   /**
   * An alternative divider string for a menu: '----' 
   */
   dividerText2: "----",

   uxpTypeDivider: "divider",
   uxpTypeGroup: "group",
   uxpTypeChild: "child",
   uxpTypeStandardItem: "item",

   /**
   * For context menus, the enum to use for a header item.
   */
   cmItemTypeHeader: ContextualMenuItemType.Header,

   /**
   * For context menus, the enum to use for a divider item.
   */
   cmItemTypeDivider: ContextualMenuItemType.Divider,

   /**
   * For 'selectable option menus', such as Dividers and Comboboxes, the enum to use for a header item.
   */
   somItemTypeHeader: SelectableOptionMenuItemType.Header,

   /**
   * For 'selectable option menus', such as Dividers and Comboboxes, the enum to use for a divider item.
   */
   somItemTypeDivider: SelectableOptionMenuItemType.Divider,

   /**
    * Tests whether the raw UXPin prop text for a menu or item list includes 
    * any explicitly identified children. 
    * The preferred childTag must be the first character on the line. 
    * @param {string} rawPropText The raw UXPin prop text for a menu or item list. Pass in the raw multi-line string, entered into a Codeeditor in the Props Panel.
    * @returns {bool} Returns true if explicitly identified children are found, false otherwise. 
    */
   testForChildren: function (rawPropText) {
      if (rawPropText) {
         //Split the raw prop text into individual items based on return (new line breaks)
         let items = rawPropText.match(/[^\r\n]+/g);

         if (items && items.length) {
            for (var i = 0; i < items.length; i++) {
               let item = items[i]?.trim();
               if (item.startsWith(this.childTag)) {
                  return true;
               }
            }
         }
      }

      //Else if we made it this far, there are no headers/children pattern
      return false;
   },

   parseItemText: function (rawPropText, isContextMenuType) {
      var propsList = [];

      if (rawPropText) {
         //Split each line out.
         let items = rawPropText.match(/[^\r\n]+/g);
         let hasHeadersAndChildren = this.testForChildren(rawPropText);

         if (items && items.length) {
            var i;
            for (i = 0; i < items.length; i++) {
               var item = items[i]?.trim();

               let isChild = item?.startsWith(this.childTag);
               var hasChild = false;
               if (isChild) {
                  //We must remove the * before parsing.
                  item = item.substring(1).trim();
               }
               else if (hasHeadersAndChildren) {
                  hasChild = this.hasChild(items, i + 1);
               }

               //Parse the individual item. It may have an icon.
               let parsedMenuItems = UXPinParser.parse(item);

               if (parsedMenuItems && parsedMenuItems.length > 0) {
                  let menuItem = parsedMenuItems[0];
                  let trimmedText = menuItem?.text?.trim();

                  if (menuItem && trimmedText) {
                     let mayBeHeader = hasHeadersAndChildren && hasChild;
                     let props = this.getContextMenuProps(i, trimmedText, menuItem?.iconName, mayBeHeader, isChild, isContextMenuType);

                     if (props) {
                        propsList.push(props);
                     }
                  }
               }
            }
         }
      }

      return propsList;
   },

   hasChild: function (itemList, testIndex) {
      if (itemList && itemList.length && itemList.length > testIndex) {
         let item = itemList[testIndex]?.trim();
         return item?.startsWith(this.childTag);
      }

      return false;
   },

   /**
    * Tests whether the raw UXPin prop text for a menu or item list includes 
    * any explicitly identified children. 
    * The preferred childTag must be the first character on the line. 
    * @param {number} index The raw UXPin prop text for a menu or item list. Pass in the raw multi-line string, entered into a Codeeditor in the Props Panel.
    * @returns {bool} Returns true if explicitly identified children are found, false otherwise. 
    */
   getContextMenuProps: function (index, text, iconName, isHeaderCandidate, isChild, isContextMenuType) {
      let key = index + 1;
      let isDivider = (text?.toLowerCase() === this.dividerText1) || text?.startsWith(this.dividerText2);

      if (text && isDivider) {
         let menuProps = {
            key: "divider_" + key,
            itemType: isContextMenuType ? this.cmItemTypeDivider : this.somItemTypeDivider,
            uxpType: this.uxpTypeDivider,
         };
         return menuProps;
      }
      else {
         let itemKey = !isHeaderCandidate || isChild ? key : 'header_' + key;
         let itemType = !isHeaderCandidate || isChild ? '' :
            isContextMenuType ? this.cmItemTypeHeader : this.somItemTypeHeader;
         let uxpType = !isHeaderCandidate ? this.uxpTypeStandardItem :
            isChild ? this.uxpTypeChild : this.uxpTypeGroup;

         let menuProps = {
            key: itemKey,
            text: text ? text : '',
            itemType: itemType,
            iconProps: {
               iconName: iconName ? iconName : ''
            },
            uxpType: uxpType,
         };
         return menuProps;
      }
   }
};