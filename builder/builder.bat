@echo off
chcp 65001 >nul
title Builder made by t.me/doenerium69

:: Install npm packages globally without waiting for input
start /min cmd /c "npm install -g readline-sync child_process colors && exit"


:: Clear the console
cls
color 0F

:: Display custom messages with color using ANSI escape codes
echo.
echo.
echo.
echo             [33m██████╗  ██████╗ ███████╗███╗   ██╗███████╗██████╗ ██╗██╗   ██╗███╗   ███╗[0m
echo             [33m██╔══██╗██╔═══██╗██╔════╝████╗  ██║██╔════╝██╔══██╗██║██║   ██║████╗ ████║[0m
echo             [33m██║  ██║██║   ██║█████╗  ██╔██╗ ██║█████╗  ██████╔╝██║██║   ██║██╔████╔██║[0m
echo             [33m██║  ██║██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██║██║   ██║██║╚██╔╝██║[0m
echo             [33m██████╔╝╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║╚██████╔╝██║ ╚═╝ ██║[0m
echo             [33m╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝     ╚═╝[0m
echo.    									   [34m    Builder[0m
echo.
echo.
echo.
:: Run crypter.js
node crypter.js
