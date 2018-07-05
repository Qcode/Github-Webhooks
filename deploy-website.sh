cd usr/share/nginx
git clone git@github.com:Qcode/Portfolio.git
cd Portfolio
yarn
yarn run build
cd ..
pwd
rm -rf html/static
mv -v Portfolio/build/* html
rm -rf Portfolio
