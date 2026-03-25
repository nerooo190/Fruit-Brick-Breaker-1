#!/usr/bin/env bash
set -euo pipefail

mkdir -p assets/fruits assets/ui

node <<'NODE'
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const write = (target, content) => {
  fs.writeFileSync(path.join(root, target), content);
};

const svg = (w, h, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">${inner}</svg>\n`;

const roundFruit = ({ bodyA, bodyB, leaf = "#3ea65c", stem = "#6a4422", name = "fruit" }) => svg(
  64,
  64,
  `
  <defs>
    <radialGradient id="g_${name}" cx="0.32" cy="0.26" r="0.75">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.55" />
      <stop offset="0.34" stop-color="${bodyA}" />
      <stop offset="1" stop-color="${bodyB}" />
    </radialGradient>
  </defs>
  <ellipse cx="32" cy="37" rx="21" ry="20" fill="url(#g_${name})" />
  <path d="M30 15c4-4 8-4 13 0" stroke="${stem}" stroke-width="3" stroke-linecap="round" />
  <path d="M36 13c7-4 13-2 17 4-7 1-12 0-17-1z" fill="${leaf}" />
  <ellipse cx="24" cy="28" rx="4" ry="3" fill="#ffffff" fill-opacity="0.42" />
  <ellipse cx="26" cy="35" rx="2.2" ry="3" fill="#213247" />
  <ellipse cx="38" cy="35" rx="2.2" ry="3" fill="#213247" />
  <path d="M27 43c2.6 2 7.4 2 10 0" stroke="#b64e5c" stroke-width="2.5" stroke-linecap="round" />
  <path d="M25 49h2M37 49h2" stroke="#213247" stroke-width="2.2" stroke-linecap="round" />
  <path d="M27 50c-1 4-2 5-3 6" stroke="#213247" stroke-width="1.8" stroke-linecap="round" />
  <path d="M37 50c1 4 2 5 3 6" stroke="#213247" stroke-width="1.8" stroke-linecap="round" />
`
);

const pineapple = svg(
  64,
  64,
  `
  <defs>
    <radialGradient id="g_pineapple" cx="0.4" cy="0.24" r="0.8">
      <stop offset="0" stop-color="#fff7a9" stop-opacity="0.7" />
      <stop offset="0.3" stop-color="#f6c63d" />
      <stop offset="1" stop-color="#d78d17" />
    </radialGradient>
  </defs>
  <path d="M31 7c-3 0-6 4-7 8 4-1 7-1 9 1 2-2 5-2 9-1-1-4-4-8-7-8-1 0-2 1-4 3-2-2-3-3-4-3z" fill="#56be6d" />
  <path d="M18 20c4-8 9-12 14-12s10 4 14 12l4 19c0 9-7 16-18 16s-18-7-18-16l4-19z" fill="url(#g_pineapple)" />
  <path d="M23 24l18 18M41 24L23 42M20 34l26 0M20 42l26 0" stroke="#b76a1e" stroke-width="2.3" stroke-linecap="round" opacity="0.6" />
  <ellipse cx="26" cy="31" rx="3.8" ry="3.1" fill="#fff" fill-opacity="0.48" />
  <ellipse cx="27" cy="36" rx="2.2" ry="3" fill="#273247" />
  <ellipse cx="38" cy="36" rx="2.2" ry="3" fill="#273247" />
  <path d="M28 43c3 2 5 2 8 0" stroke="#b64e5c" stroke-width="2.5" stroke-linecap="round" />
  <path d="M26 49c-1 3-1 4-2 6" stroke="#273247" stroke-width="1.8" stroke-linecap="round" />
  <path d="M38 49c1 3 1 4 2 6" stroke="#273247" stroke-width="1.8" stroke-linecap="round" />
`
);

const banana = svg(
  64,
  64,
  `
  <defs>
    <linearGradient id="g_banana" x1="14" y1="14" x2="48" y2="50" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff9a0" />
      <stop offset="0.48" stop-color="#ffdb4c" />
      <stop offset="1" stop-color="#d5a62a" />
    </linearGradient>
  </defs>
  <path d="M15 37c1 10 10 17 20 17 13 0 19-8 21-22 1-8-1-16-4-20-5 10-11 16-18 19-6 2-13 3-19 6z" fill="url(#g_banana)" />
  <path d="M47 13c2-1 4-1 5 1" stroke="#7f5a1a" stroke-width="2.6" stroke-linecap="round" />
  <path d="M18 34c6-3 12-5 17-6 7-2 13-7 18-14" stroke="#f4c83d" stroke-width="6" stroke-linecap="round" fill="none" />
  <ellipse cx="29" cy="31" rx="2.5" ry="3" fill="#273247" />
  <ellipse cx="39" cy="28" rx="2.5" ry="3" fill="#273247" />
  <path d="M30 39c4 2 7 2 10 0" stroke="#b64e5c" stroke-width="2.2" stroke-linecap="round" />
  <path d="M30 46c-1 3-2 5-3 7" stroke="#273247" stroke-width="1.7" stroke-linecap="round" />
  <path d="M39 46c1 3 2 5 3 7" stroke="#273247" stroke-width="1.7" stroke-linecap="round" />
`
);

const watermelon = svg(
  64,
  64,
  `
  <defs>
    <linearGradient id="g_watermelon" x1="14" y1="17" x2="49" y2="47" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#8ef08b" />
      <stop offset="0.22" stop-color="#ff5f65" />
      <stop offset="1" stop-color="#d92e42" />
    </linearGradient>
  </defs>
  <path d="M18 42c7-18 17-27 28-27 7 0 13 4 18 11-5 11-13 18-25 22-8 3-14 2-21-6z" fill="url(#g_watermelon)" />
  <path d="M18 42c9-2 17-2 25 0 9 2 16 1 21-6" stroke="#2a7f39" stroke-width="4" stroke-linecap="round" fill="none" />
  <path d="M29 31l2 2M35 28l2 2M40 33l2 2M33 36l2 2" stroke="#59211b" stroke-width="2.2" stroke-linecap="round" />
  <ellipse cx="30" cy="34" rx="2.4" ry="3" fill="#273247" />
  <ellipse cx="40" cy="31" rx="2.4" ry="3" fill="#273247" />
  <path d="M31 41c4 2 8 2 12 0" stroke="#c13048" stroke-width="2.2" stroke-linecap="round" />
  <path d="M28 47c-1 3-1 5-2 7" stroke="#273247" stroke-width="1.7" stroke-linecap="round" />
  <path d="M41 47c1 3 1 5 2 7" stroke="#273247" stroke-width="1.7" stroke-linecap="round" />
`
);

const strawberry = svg(
  64,
  64,
  `
  <defs>
    <radialGradient id="g_strawberry" cx="0.35" cy="0.25" r="0.78">
      <stop offset="0" stop-color="#ffd0d4" stop-opacity="0.56" />
      <stop offset="0.35" stop-color="#ff5f75" />
      <stop offset="1" stop-color="#d82345" />
    </radialGradient>
  </defs>
  <path d="M32 12c3 0 6 1 8 4 4 0 7 1 10 3-1 3-3 5-6 7-1 13-6 24-12 29-6-5-11-16-12-29-3-2-5-4-6-7 3-2 6-3 10-3 2-3 5-4 8-4z" fill="url(#g_strawberry)" />
  <path d="M22 14c4 3 8 4 10 4s6-1 10-4" stroke="#49b55a" stroke-width="4" stroke-linecap="round" fill="none" />
  <circle cx="26" cy="28" r="1.7" fill="#fff0a8" />
  <circle cx="37" cy="27" r="1.7" fill="#fff0a8" />
  <circle cx="31" cy="34" r="1.7" fill="#fff0a8" />
  <circle cx="23" cy="38" r="1.7" fill="#fff0a8" />
  <circle cx="41" cy="37" r="1.7" fill="#fff0a8" />
  <ellipse cx="27" cy="31" rx="2.2" ry="2.8" fill="#273247" />
  <ellipse cx="38" cy="31" rx="2.2" ry="2.8" fill="#273247" />
  <path d="M29 40c3 2 6 2 8 0" stroke="#b43143" stroke-width="2.2" stroke-linecap="round" />
  <path d="M26 47c-1 3-2 5-3 6" stroke="#273247" stroke-width="1.7" stroke-linecap="round" />
  <path d="M37 47c1 3 2 5 3 6" stroke="#273247" stroke-width="1.7" stroke-linecap="round" />
`
);

const heart = svg(
  64,
  64,
  `
  <defs>
    <linearGradient id="g_heart" x1="18" y1="14" x2="48" y2="52" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ff9aa2" />
      <stop offset="0.4" stop-color="#ff5f72" />
      <stop offset="1" stop-color="#d3314c" />
    </linearGradient>
  </defs>
  <path d="M32 53S10 39 10 24c0-7 5-13 13-13 5 0 8 2 9 5 1-3 4-5 9-5 8 0 13 6 13 13 0 15-22 29-22 29z" fill="url(#g_heart)" stroke="#a61c36" stroke-width="2" />
  <path d="M23 18c3-2 6-1 8 2" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.44" />
  <path d="M18 26c2 8 8 14 14 18" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.2" />
`
);

const genericRound = (name, bodyA, bodyB, leaf, stem) =>
  roundFruit({ name, bodyA, bodyB, leaf, stem });

const assets = {
  "assets/fruits/apple.svg": genericRound("apple", "#ff8891", "#cd233b", "#4fb964", "#7d4b24"),
  "assets/fruits/orange.svg": genericRound("orange", "#ffc05a", "#f07f20", "#52b964", "#8a4d1c"),
  "assets/fruits/lemon.svg": genericRound("lemon", "#fff07c", "#e0ba2c", "#5ad172", "#8b5b20"),
  "assets/fruits/pear.svg": genericRound("pear", "#c3ef77", "#79b43d", "#55bb68", "#6f4c21"),
  "assets/fruits/peach.svg": genericRound("peach", "#ffb5a7", "#f16a63", "#56ba66", "#7f4c25"),
  "assets/fruits/plum.svg": genericRound("plum", "#a57aff", "#6a3eb8", "#63c16b", "#6f4222"),
  "assets/fruits/cherry.svg": genericRound("cherry", "#ff6f86", "#d92f50", "#4dba69", "#7b4120"),
  "assets/fruits/grape.svg": genericRound("grape", "#b78aff", "#7e46d0", "#61bd70", "#6f3f24"),
  "assets/fruits/kiwi.svg": genericRound("kiwi", "#9ad05e", "#5e8f2b", "#56b56b", "#6b4520"),
  "assets/fruits/berry.svg": genericRound("berry", "#65a5ff", "#2c65d8", "#52b465", "#6a4a22"),
  "assets/fruits/banana.svg": banana,
  "assets/fruits/pineapple.svg": pineapple,
  "assets/fruits/watermelon.svg": watermelon,
  "assets/fruits/melon.svg": genericRound("melon", "#8fe77d", "#46a557", "#54bb66", "#6a4720"),
  "assets/fruits/strawberry.svg": strawberry,
  "assets/ui/heart.svg": heart,
  "assets/ui/trophy.svg": svg(
    64,
    64,
    `
    <defs>
      <linearGradient id="g_trophy" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#fff1a0" />
        <stop offset="0.45" stop-color="#ffd24d" />
        <stop offset="1" stop-color="#dda11e" />
      </linearGradient>
    </defs>
    <path d="M19 10h26v6c0 8-5 15-13 16-8-1-13-8-13-16v-6z" fill="url(#g_trophy)" />
    <path d="M15 14h-7c0 7 3 11 9 12M49 14h7c0 7-3 11-9 12" stroke="#ffd24d" stroke-width="3" stroke-linecap="round" />
    <rect x="26" y="30" width="12" height="10" rx="2" fill="#ffd24d" />
    <rect x="22" y="40" width="20" height="6" rx="3" fill="#c9981c" />
  `
  ),
  "assets/ui/clock.svg": svg(
    64,
    64,
    `
    <circle cx="32" cy="32" r="25" fill="#ffffff" fill-opacity="0.7" />
    <circle cx="32" cy="32" r="20" stroke="#62c8f8" stroke-width="4" />
    <path d="M32 20v13l8 5" stroke="#62c8f8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  `
  ),
  "assets/ui/bg-pattern.svg": svg(
    420,
    420,
    `
    <rect width="420" height="420" fill="#9aeef8" />
    <circle cx="88" cy="74" r="38" fill="#ffffff" fill-opacity="0.85" />
    <circle cx="128" cy="70" r="28" fill="#ffffff" fill-opacity="0.75" />
    <circle cx="320" cy="96" r="60" fill="#ffffff" fill-opacity="0.42" />
    <circle cx="290" cy="72" r="36" fill="#ffffff" fill-opacity="0.48" />
    <circle cx="84" cy="320" r="72" fill="#ffffff" fill-opacity="0.2" />
    <circle cx="348" cy="298" r="96" fill="#ffffff" fill-opacity="0.16" />
  `
  ),
};

for (const [file, content] of Object.entries(assets)) {
  write(file, content);
}
NODE

echo "Assets generated in assets/fruits and assets/ui"
