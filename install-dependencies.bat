@echo off
echo Instalando dependencias do backend...
cd oab-backend
pip install -r requirements.txt
echo.
echo Instalando dependencias do frontend...
cd ..\oab-frontend
npm install
echo.
echo Dependencias instaladas com sucesso!
pause

