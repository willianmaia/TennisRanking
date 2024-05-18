@echo off
title Alternar entre abas

:loop
rem Simular o pressionamento de Ctrl + Tab
powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('^{TAB}')"
rem Aguardar 1 segundo
timeout /t 1 /nobreak > nul
rem Simular o pressionamento da tecla F5
powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('{F5}')"
rem Aguardar 9 segundos
timeout /t 9 /nobreak > nul
rem Retornar ao início do loop
goto loop
