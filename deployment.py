import os
import paramiko

root = os.path.dirname(os.path.abspath(__file__))
ssh = paramiko.SSHClient()


def compress_folder():
    os.chdir(root)
    if os.path.exists("proxy.zip"):
        os.remove("proxy.zip")
    os.system("7z a -tzip -r proxy.zip . -x!ssh -x!.git -x!node_modules -x!*.py -x!*.env -x!*.pem")


def connect():
    key_path = os.path.join(root, "ssh", "production.pem")
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname="172.24.144.93", username="ubuntu", key_filename=key_path)


def upload():
    sftp = ssh.open_sftp()
    sftp.put("proxy.zip", "/home/ubuntu/proxy.zip")
    sftp.close()


def unzip():
    ssh.exec_command("rm -rf /home/ubuntu/proxy !(node_modules) !(.env)")
    stdin_unzip, stdout_unzip, stderr_unzip = ssh.exec_command(
        'export PATH="/home/ubuntu/.nvm/versions/node/v20.16.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin" && cd /home/ubuntu/ && unzip -qo /home/ubuntu/proxy.zip -d /home/ubuntu/proxy && cd proxy && npm i',
    )
    stdout_unzip.channel.recv_exit_status()
    stderr_unzip.channel.recv_exit_status()

    for line in stdout_unzip.readlines():
        print(line, end="")

    for line in stderr_unzip.readlines():
        print(line, end="")


def deploy():
    compress_folder()
    connect()
    upload()
    unzip()
    ssh.close()


if __name__ == "__main__":
    deploy()
