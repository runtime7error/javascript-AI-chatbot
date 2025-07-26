@echo off
title Instalador do Ollama & Modelo

chcp 65001 >nul

set "MODELO=gemma3:1b-it-qat"
set "OLLAMA_CMD=ollama"

echo ============================================
echo  INSTALADOR DO CHATBOT LOCAL COM OLLAMA
echo ============================================

where %OLLAMA_CMD% >nul 2>&1
if errorlevel 1 (
    echo [1/3] Ollama não encontrado. Baixando instalador...
    powershell -Command "Invoke-WebRequest -Uri 'https://ollama.com/download/OllamaSetup.exe' -OutFile 'OllamaSetup.exe'"
    echo [ ] Executando instalador do Ollama...
    start /wait "" "OllamaSetup.exe"
) else (
    echo [1/3] Ollama já instalado.
)

echo [2/3] Iniciando o servidor Ollama...
start /min "" %OLLAMA_CMD% serve

echo Aguardando o Ollama ficar disponível...
timeout /t 8 >nul

echo [3/3] Verificando modelo gemma3:1b-it-qat...
%OLLAMA_CMD% list | findstr /i "gemma3:1b-it-qat" >nul
if errorlevel 1 (
    echo Modelo "gemma3:1b-it-qat" não encontrado. Fazendo pull...
    %OLLAMA_CMD% pull "gemma3:1b-it-qat"
) else (
    echo Modelo "gemma3:1b-it-qat" já instalado.
)

echo.
echo ✅ Tudo pronto! Use botstart.bat para rodar seu assistente.
pause
