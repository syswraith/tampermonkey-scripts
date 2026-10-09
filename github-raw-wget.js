// ==UserScript==
// @name         GitHub raw wget
// @namespace    http://tampermonkey.net/
// @version      2026-10-09
// @description  Copy wget command for GitHub files
// @author       syswraith
// @match        https://github.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(() => {
    'use strict';

    let lastKey = 0;

    function toast(message) {
        const el = document.createElement('div');
        el.textContent = message;

        Object.assign(el.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 16px',
            background: '#282828',
            color: '#ebdbb2',
            border: '1px solid #504945',
            borderRadius: '6px',
            font: '13px monospace',
            zIndex: '999999',
        });

        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1800);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'y' || event.ctrlKey || event.altKey || event.metaKey) {
            lastKey = 0;
            return;
        }

        const now = Date.now();

        if (now - lastKey > 500) {
            lastKey = now;
            return;
        }

        lastKey = 0;

        const match = location.pathname.match(/^\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);

        if (!match) {
            toast('Not a GitHub file page');
            return;
        }

        const [, owner, repo, branch, path] = match;
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
        const command = `wget "${rawUrl}"`;

        GM_setClipboard(command);
        toast(`Copied ${command}`);
    });
})();

