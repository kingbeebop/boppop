import click
from commands.challenge import challenge

@click.group()
def cli():
    """BopPop management CLI"""
    pass

cli.add_command(challenge)

if __name__ == '__main__':
    cli() 