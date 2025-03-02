// ==UserScript==
// @name         B站AI字幕提取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  提取B站视频AI小助手的字幕列表
// @author       wwei
// @match        *://*.bilibili.com/video/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // 创建提取按钮
    function createExtractButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '提取字幕';
        btn.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            padding: 8px 16px;
            background: #00a1d6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        // 添加悬停效果
        btn.onmouseover = () => btn.style.backgroundColor = '#00b5e5';
        btn.onmouseout = () => btn.style.backgroundColor = '#00a1d6';

        document.body.appendChild(btn);
        return btn;
    }

    // 提取字幕内容
    function extractSubtitles() {
        const subtitles = [];
        const timeNodes = document.querySelectorAll('._TimeText_1iu0q_35');
        const textNodes = document.querySelectorAll('._Text_1iu0q_64');

        if (!timeNodes.length || !textNodes.length) {
            alert('未找到字幕内容,请确保AI小助手已打开');
            return;
        }

        for (let i = 0; i < timeNodes.length; i++) {
            subtitles.push(`${timeNodes[i].textContent} ${textNodes[i].textContent}`);
        }

        return subtitles.join('\n');
    }

    // 复制到剪贴板并显示提示
    function copyToClipboard(text) {
        GM_setClipboard(text);

        // 创建提示元素
        const tip = document.createElement('div');
        tip.textContent = '字幕已复制到剪贴板!';
        tip.style.cssText = `
            position: fixed;
            top: 150px;
            right: 20px;
            z-index: 10000;
            padding: 8px 16px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 4px;
            font-size: 14px;
        `;

        document.body.appendChild(tip);

        // 2秒后移除提示
        setTimeout(() => {
            document.body.removeChild(tip);
        }, 2000);
    }

    // 初始化
    function init() {
        const extractBtn = createExtractButton();
        extractBtn.addEventListener('click', () => {
            const subtitles = extractSubtitles();
            if (subtitles) {
                copyToClipboard(subtitles);
            }
        });
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
