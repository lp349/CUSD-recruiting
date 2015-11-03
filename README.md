#
CUSD-recruiting
New Django-based website for CUSD recruiting

To get the latest build working, run the following commands for dependencies:

    sudo pip install django_compressor
    sudo pip install django_libsass
      (if compilation terminates here with a Python.h error, run this: sudo apt-get install python2.7-dev)
    sudo pip install django_bower

    sudo apt-get install ruby-full or brew install ruby
    sudo gem install compass
    sudo gem install sass
    sudo pip instal pyyaml

To set up local db:
- Install postgresql using your app manager (brew for Mac / apt-get for Ubuntu)

To set up joincusd_db
- Start postgres if not currently running
    launchctl load /usr/local/Cellar/postgresql/[vername]/homebrew.mxcl.postgresql.plist
- Run the following commands:
    createdb joincusd_db
    psql joincusd_db
    CREATE USER joincusd_dev WITH PASSWORD ‘cusd’;
- Run python manage.py runserver and ensure everything’s working
- Make Migrations
    python manage.py makemigrations
    python manage.py migrate
- To import fixtures
    python manage.py loaddata fixtures/[fixturename]




