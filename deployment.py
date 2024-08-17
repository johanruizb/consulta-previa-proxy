import os
import paramiko

root = os.path.dirname(os.path.abspath(__file__))
ssh = paramiko.SSHClient()

PATH = "export PATH=/home/ubuntu/.nvm/versions/node/v20.16.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
PROJECT_PATH = "/home/ubuntu/registro-consulta-previa/source"


def connect():
    key_path = os.path.join(root, "ssh", "production.pem")
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname="172.24.144.93", username="ubuntu", key_filename=key_path)


def fetch():
    ssh.exec_command(f"cd {PROJECT_PATH} && git pull origin master")
    stdin_unzip, stdout_unzip, stderr_unzip = ssh.exec_command(
        f"{PATH} && cd {PROJECT_PATH} && pm2 deploy ecosystem.config.js production update",
    )
    stdout_unzip.channel.recv_exit_status()
    stderr_unzip.channel.recv_exit_status()

    for line in stdout_unzip.readlines():
        print(line, end="")

    for line in stderr_unzip.readlines():
        print(line, end="")


def deploy():
    connect()
    fetch()
    ssh.close()


if __name__ == "__main__":
    deploy()
