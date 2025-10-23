// Thanks to Powercord and Zere
// https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/DoNotTrack/DoNotTrack.plugin.js
// https://github.com/powercord-org/powercord/blob/v2/src/Powercord/coremods/no-track/index.js

import { Plugin } from "../entities";
import { getByProps } from "../metro";
import { insteadDoNothing } from "../utils/patcher";

export default class NoTrack extends Plugin {
    public start() {
        const Reporter = getByProps("submitLiveCrashReport");
        const Metadata = getByProps("trackWithMetadata");
        const Analytics = getByProps("AnalyticsActionHandlers");
        const Properties = getByProps("encodeProperties", "track");

        if (Properties) insteadDoNothing(Properties, "track");
        if (Reporter) insteadDoNothing(Reporter, "submitLiveCrashReport");
        if (Analytics) insteadDoNothing(Analytics.AnalyticsActionHandlers, "handleTrack");
        if (Metadata) insteadDoNothing(Metadata, "trackWithMetadata");

        const Sentry = {
            main: window.__SENTRY__?.hub,
            client: window.__SENTRY__?.hub?.getClient(),
            logger: window.__SENTRY__?.logger
        };

        if (Sentry.main && Sentry.client) {
            Sentry.client.close();
            Sentry.logger.disable();
            Sentry.main.getStackTop().scope.clear();
            Sentry.main.getScope().clear();
            insteadDoNothing(Sentry.main, "addBreadcrumb");
        }
    }
}
