import {m} from 'malevic';
import {Shortcut, Toggle} from '../../../controls';
import {getLocalMessage} from '../../../../utils/locales';
import type {ExtWrapper, UserSettings} from '../../../../definitions';
import SunMoonIcon from '../../main-page/sun-moon-icon';
import SystemIcon from '../../main-page/system-icon';
import WatchIcon from '../../main-page/watch-icon';
import SiteToggle from '../site-toggle';
import MoreToggleSettings from './more-toggle-settings';
import {AutomationMode} from '../../../../utils/automation';
import {isLocalFile} from '../../../../utils/url';
import {isChromium} from '../../../../utils/platform';

function multiline(...lines: string[]) {
    return lines.join('\n');
}

type HeaderProps = ExtWrapper & {
    onMoreToggleSettingsClick: () => void;
};

function Header({data, actions, onMoreToggleSettingsClick}: HeaderProps) {
    function toggleExtension(enabled: UserSettings['enabled']) {
        actions.changeSettings({
            enabled,
            automation: {...data.settings.automation, ...{enabled: false}},
        });
    }

    const tab = data.activeTab;
    const isFile = isChromium && isLocalFile(tab.url);
    const isAutomation = data.settings.automation.enabled;
    const isTimeAutomation = data.settings.automation.mode === AutomationMode.TIME;
    const isLocationAutomation = data.settings.automation.mode === AutomationMode.LOCATION;
    const now = new Date();

    return (
        <header class="header">
            <a class="header__logo" href="https://darkreader.org/" target="_blank" rel="noopener noreferrer">
                Dark Reader
            </a>
            <div class="header__control header__site-toggle">
                <SiteToggle
                    data={data}
                    actions={actions}
                />
                {!isFile && (tab.isProtected || !tab.isInjected) ? (
                    <span class="header__site-toggle__unable-text">
                        {getLocalMessage('page_protected')}
                    </span>
                ) : isFile && !data.isAllowedFileSchemeAccess ? (
                    <span class="header__site-toggle__unable-text">
                        {getLocalMessage('local_files_forbidden')}
                    </span>
                ) : tab.isInDarkList ? (
                    <span class="header__site-toggle__unable-text">
                        {getLocalMessage('page_in_dark_list')}
                    </span>
                ) : (
                    <Shortcut
                        commandName="addSite"
                        shortcuts={data.shortcuts}
                        textTemplate={(hotkey) => (hotkey
                            ? multiline(getLocalMessage('toggle_current_site'), hotkey)
                            : getLocalMessage('setup_hotkey_toggle_site')
                        )}
                        onSetShortcut={(shortcut) => actions.setShortcut('addSite', shortcut)}
                    />
                )}
            </div>
            <div class="header__control header__app-toggle">
                <Toggle checked={data.isEnabled} labelOn={getLocalMessage('on')} labelOff={getLocalMessage('off')} onChange={toggleExtension} />
                <Shortcut
                    commandName="toggle"
                    shortcuts={data.shortcuts}
                    textTemplate={(hotkey) => (hotkey
                        ? multiline(getLocalMessage('toggle_extension'), hotkey)
                        : getLocalMessage('setup_hotkey_toggle_extension')
                    )}
                    onSetShortcut={(shortcut) => actions.setShortcut('toggle', shortcut)}
                />
                <span
                    class="header__app-toggle__more-button"
                    onclick={onMoreToggleSettingsClick}
                ></span>
                <span
                    class={{
                        'header__app-toggle__time': true,
                        'header__app-toggle__time--active': isAutomation,
                    }}
                >
                    {(isTimeAutomation
                        ? <WatchIcon hours={now.getHours()} minutes={now.getMinutes()} />
                        : (isLocationAutomation
                            ? (<SunMoonIcon date={now} latitude={data.settings.location.latitude} longitude={data.settings.location.longitude} />)
                            : <SystemIcon />))}
                </span>
            </div>
        </header>
    );
}

export {
    Header,
    MoreToggleSettings, // TODO: Implement portals to place elements into <body>.
};
