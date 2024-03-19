import multiprocessing

# Bind to a Unix socket
# bind = 'unix:/var/run/gunicorn/socket.sock'
bind = '127.0.0.1:8000'

# Number of workers
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'gthread'
threads = 2
timeout = 60

# Optional settings
# accesslog = '/path/to/your/access.log'
# errorlog = '/path/to/your/error.log'

#gunicorn start command:
# /home/bop/boppop/venv/bin/gunicorn -c gunicorn_config.py boppop.wsgi:application
#ExecStart=sudo /home/bop/boppop/venv/bin/gunicorn boppop.wsgi:application --bind unix:var/run/gunicorn/socket.sock
