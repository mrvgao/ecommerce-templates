import socket


def in_test_server():
    '''
    tests whether this project is running on the test server.
    if run in the test server, its ip address will be '127***' or '192'

    Args:
      None
    Return:
      result: Boolean, test if in the test server or deploy server.
              if in test server, return *True*, if in deploy server,
              return *False*
    '''
    ip_address = socket.gethostbyname(socket.gethostname())
    print(ip_address)
    key_words = ['127', '192']

    result = False
    for word in key_words:
        if ip_address.startswith(word):
            result = True
            break

    if result:
      print('in test server')
    else:
      print('in deploy server')
    print 'is test server: %s' % result
    return result


if __name__ == '__main__':
    print(in_test_server())
