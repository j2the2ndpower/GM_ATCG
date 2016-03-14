var target = argument0;
if (global.uiFocus != noone) {
    (global.uiFocus).hasFocus = false;
}

global.uiFocus = target;
(global.uiFocus).hasFocus = true;
