import{r as f}from"./vendor_react-BO86OV0u.js";var s={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=f;function i(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var S=typeof Object.is=="function"?Object.is:i,d=r.useState,l=r.useEffect,E=r.useLayoutEffect,v=r.useDebugValue;function p(e,t){var u=t(),o=d({inst:{value:u,getSnapshot:t}}),n=o[0].inst,a=o[1];return E(function(){n.value=u,n.getSnapshot=t,c(n)&&a({inst:n})},[e,u,t]),l(function(){return c(n)&&a({inst:n}),e(function(){c(n)&&a({inst:n})})},[e]),v(u),u}function c(e){var t=e.getSnapshot;e=e.value;try{var u=t();return!S(e,u)}catch{return!0}}function y(e,t){return t()}var h=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?y:p;s.useSyncExternalStore=r.useSyncExternalStore!==void 0?r.useSyncExternalStore:h;
