
#!/bin/bash

python3 backend/src/manage.py test bak

cd frontend
ng test --watch=false