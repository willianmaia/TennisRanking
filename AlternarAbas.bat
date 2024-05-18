@echo off
title Alternar entre abas

:loop
rem Simular o pressionamento de Ctrl + Tab
powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('^{TAB}')"
rem Aguardar 10 segundos
timeout /t 10 /nobreak > nul
rem Retornar ao início do loop
goto loop
