import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');
Config.setCrf(18);

// Keep concurrency conservative for constrained/CI-style environments.
Config.setConcurrency(2);

// Global safety net matching the timeout used by src/styles/loadFonts.ts —
// avoids spurious render failures if a browser tab is briefly slow to load
// the local font files under concurrent rendering.
Config.setDelayRenderTimeoutInMilliseconds(45000);
