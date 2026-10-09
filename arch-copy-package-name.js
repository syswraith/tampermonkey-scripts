// ==UserScript==
// @name         Arch copy package name
// @namespace    http://tampermonkey.net/
// @version      2026-10-09
// @description  Copy package installation command with yy
// @author       syswraith
// @match        https://aur.archlinux.org/packages/*
// @match        https://archlinux.org/packages/*
// @grant        GM_setClipboard
// ==/UserScript==

(() => {
    'use strict';

    const aurSelector = '#pkginfo > tbody > tr:nth-child(2) > td > a';
    const archSelector = '#pkgdetails > h2';

    const aur = location.hostname === 'aur.archlinux.org';
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

        const pkg = aur
            ? document.querySelector(aurSelector)?.innerText.trim()
            : document.querySelector(archSelector)?.innerText.trim().split(/\s+/)[0];

        if (!pkg) return;

        const command = aur
            ? `yes | yay -Sy ${pkg}`
            : `yes | sudo pacman -Sy ${pkg}`;

        GM_setClipboard(command);
        toast(`Copied: ${command}`);
    });
})();

