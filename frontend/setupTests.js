import "@testing-library/jest-dom";

// jsdom (used by jest) doesn't provide TextEncoder/TextDecoder by default.
// React Router (and possibly other libs) rely on them, so polyfill from node.
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// jsdom does not implement video playback; mock the methods so components can call
if (typeof HTMLMediaElement !== "undefined") {
  // return a promise so callers can chain .catch without blowing up
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
  HTMLMediaElement.prototype.pause = jest.fn();
}
