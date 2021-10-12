import {MenuTemplate} from 'telegraf-inline-menu';
import {MyContext} from '../../my-context.js';

import {education_level_select_menu} from "./education_level_select/education_level_select_menu.js";
import {group_select_menu} from "./group_select/group_select_menu.js";
import {language_select_menu} from "./language/language_select_menu.js";
import {backButtons} from '../general.js';

export const settingsMenu = new MenuTemplate<MyContext>(context => context.i18n.t('settings.body'));

settingsMenu.submenu(context => context.i18n.t('settings.edu_level'), 'edu_level', education_level_select_menu);
settingsMenu.submenu(context => context.i18n.t('settings.group_set'), 'group_set', group_select_menu)
settingsMenu.submenu(context => context.i18n.t('settings.lang_select'), 'lang_select', language_select_menu)
settingsMenu.manualRow(backButtons);
