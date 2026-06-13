import sqlite3
conn=sqlite3.connect('backend/dev.sqlite3')
c=conn.cursor()
print('tables:')
for r in c.execute("SELECT name FROM sqlite_master WHERE type='table'"):
    print('-',r[0])
print('\nusuarios rows:')
for r in c.execute('SELECT id,nome,email,pontos FROM usuarios'):
    print(r)
print('\nconquistas rows:')
for r in c.execute('SELECT id,chave,titulo,pontos FROM conquistas'):
    print(r)
print('\nusuario_conquistas rows:')
for r in c.execute('SELECT id,usuario_id,conquista_id FROM usuario_conquistas'):
    print(r)
conn.close()
