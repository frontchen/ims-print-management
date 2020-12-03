from fabric import task, Connection


step_index = 0


def step(description='just do it'):
    global step_index
    step_index += 1
    print('\nSTEP {}: {}'.format(step_index, description))


@task
def deploy_test(c):
    # 连接测试环境部署服务器
    c = Connection('218.29.54.49', port=2206, user='root', connect_kwargs={
        'password': 'Josh@VPS2018',
    })
    # 上传文件
    step('Upload dist files to server')
    c.put('.temp/dist.tar', '/opt/test-projects/wistar-supply/')

    # 解压文件
    step('Untar the files')
    c.run('cd /opt/test-projects/wistar-supply/ && tar -xvf dist.tar')

    print('Deployed successfully!')

@task
def deploy(c):
    # 连接生产环境部署服务器
    c = Connection('47.96.123.40', port=22, user='root', connect_kwargs={
        'password': 'Wistar2019@',
    })
    # 上传文件
    step('Upload dist files to server')
    c.put('.temp/dist.tar', '/opt/projects/wistar-supply/')

    # 解压文件
    step('Untar the files')
    c.run('cd /opt/projects/wistar-supply/ && tar -xvf dist.tar')

    print('Deployed successfully!')    
