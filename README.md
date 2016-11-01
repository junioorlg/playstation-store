Requeriments:

- Server apache2
- php5
- contection to internet (bookstores are instantiated to their CDN) 

Clone or donwoload: https://github.com/junioorlg/playstation-store.git

Linux:
Copy the app in the web server  (case apache)
cp -R playstation-store/  /var/www/html/.

Give permissions in the folder ‘media’
chmod 777 -R /var/www/html/playstation-store/media/

Windows:
if you use xampp:
- Copy app:  playstation-store in the route : C://xammp/htdocs/.
if you not use xampp:
- copy app in the web server: example C://binamit/www/.