import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons} from '../general.js';
import {MyContext} from '../../my-context.js';
import {educationLevelMenu} from "./educationLevelMenu.js";
import {selectGroupMenu} from "./selectGroupMenu.js";

export const settingsMenu = new MenuTemplate<MyContext>(context => context.i18n.t('settings.body'));

settingsMenu.submenu(context => context.i18n.t('settings.edu_level'), 'edu_level', educationLevelMenu);
settingsMenu.submenu(context => context.i18n.t('settings.group_set'), 'group_set', selectGroupMenu)

settingsMenu.manualRow(backButtons);
