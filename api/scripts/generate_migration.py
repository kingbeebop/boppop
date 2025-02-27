#!/usr/bin/env python3
import os
import sys
from alembic import command
from alembic.config import Config

def main(message):
    # Get the directory containing this script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(current_dir)
    
    # Create Alembic configuration
    alembic_cfg = Config(os.path.join(root_dir, "alembic.ini"))
    alembic_cfg.set_main_option("script_location", os.path.join(root_dir, "alembic"))
    
    # Generate the migration
    command.revision(alembic_cfg, message=message, autogenerate=True)

if __name__ == "__main__":
    message = sys.argv[1] if len(sys.argv) > 1 else "migration"
    main(message) 