import urllib.request, json, urllib.error

def post(url, data):
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type':'application/json'}, method='POST')
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        print('POST', url, '->', resp.status)
        print(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print('POST', url, 'HTTP', e.code)
        print(e.read().decode('utf-8'))
    except Exception as e:
        print('POST', url, 'ERR', e)


def get(url):
    try:
        resp = urllib.request.urlopen(url, timeout=10)
        print('GET', url, '->', resp.status)
        print(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print('GET', url, 'HTTP', e.code)
        print(e.read().decode('utf-8'))
    except Exception as e:
        print('GET', url, 'ERR', e)

if __name__ == '__main__':
    base='http://127.0.0.1:8000'
    print('Creating user...')
    post(base + '/usuarios/', {'nome':'Teste','email':'teste@example.com','senha':'senha123','situacao_atual':'DESEMPREGADO'})
    print('\nInitial gamificacao:')
    get(base + '/gamificacao/1')
    print('\nSimular CLT...')
    post(base + '/simular/clt', {'salario_bruto':3500,'dependentes':0})
    print('\nCriar lembrete...')
    post(base + '/lembretes/', {'titulo':'Pagar conta','descricao':'Test','data_vencimento':'2026-06-20','categoria':'FISCAL','prioridade':'MEDIA'})
    print('\nFinal gamificacao:')
    get(base + '/gamificacao/1')
