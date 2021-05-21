git pull &&      # Update git repo 
npm i &&         # Install npm modules
npm run build && # Compile react
pm2 restart BRC  # Restart pm2 process