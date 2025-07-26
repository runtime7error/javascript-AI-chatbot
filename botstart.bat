@echo off
title Configurar IA

chcp 65001 >nul

echo ============================================
echo BEM-VINDO AO CONFIGURADOR DO CHATBOT
echo ============================================

set /p BOT_NAME=Digite o NOME da sua I.A: 

echo.
echo Escreva como voce quer que sua I.A se comporte.
echo Exemplo: "Você é uma I.A simpática, engraçada e sempre responde com bom humor."
set /p BOT_PROMPT=Descreva o comportamento da I.A: 

echo.
echo Iniciando o assistente virtual: %BOT_NAME%
echo Com comportamento: %BOT_PROMPT%
echo ============================================

echo.
echo Gerando config.json...
(
  echo {
  echo   "botName": "%BOT_NAME%",
  echo   "botPrompt": "%BOT_PROMPT%"
  echo }
) > config.json

start "" "wscript.exe" "start_hidden.vbs"