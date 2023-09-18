import table from './components/data/Table.config'
import accordion from './components/elements/Accordion.config'
import alert from './components/elements/Alert.config'
import avatar from './components/elements/Avatar.config'
import avatarGroup from './components/elements/AvatarGroup.config'
import badge from './components/elements/Badge.config'
import button from './components/elements/Button.config'
import buttonGroup from './components/elements/ButtonGroup.config'
import dropdown from './components/elements/Dropdown.config'
import kbd from './components/elements/Kbd.config'
import checkbox from './components/forms/Checkbox.config'
import form from './components/forms/Form.config'
import formGroup from './components/forms/FormGroup.config'
import input from './components/forms/Input.config'
import radio from './components/forms/Radio.config'
import range from './components/forms/Range.config'
import select from './components/forms/Select.config'
import selectMenu from './components/forms/SelectMenu.config'
import textarea from './components/forms/Textarea.config'
import toggle from './components/forms/Toggle.config'
import card from './components/layout/Card.config'
import container from './components/layout/Container.config'
import skeleton from './components/layout/Skeleton.config'
import commandPalette from './components/navigation/CommandPalette.config'
import pagination from './components/navigation/Pagination.config'
import tabs from './components/navigation/Tabs.config'
import verticalNavigation from './components/navigation/VerticalNavigation.config'
import contextMenu from './components/overlays/ContextMenu.config'
import modal from './components/overlays/Modal.config'
import notification from './components/overlays/Notification.config'
import notifications from './components/overlays/Notifications.config'
import popover from './components/overlays/Popover.config'
import slideover from './components/overlays/Slideover.config'
import tooltip from './components/overlays/Tooltip.config'

const config = {
  table,
  accordion,
  alert,
  avatar,
  avatarGroup,
  badge,
  button,
  buttonGroup,
  dropdown,
  kbd,
  checkbox,
  form,
  formGroup,
  input,
  radio,
  range,
  select,
  selectMenu,
  textarea,
  toggle,
  card,
  container,
  skeleton,
  commandPalette,
  pagination,
  tabs,
  verticalNavigation,
  contextMenu,
  modal,
  notification,
  notifications,
  popover,
  slideover,
  tooltip
}

export type Config = typeof config
