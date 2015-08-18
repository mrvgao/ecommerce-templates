#-*- coding:utf-8 -*-


class settings:
    # 安全检验码，以数字和字母组成的32位字符
    ALIPAY_KEY = '1dcae83sn26nxvsi58kcgf8tm9gjey6h'

    ALIPAY_INPUT_CHARSET = 'utf-8'

    # 合作身份者ID，以2088开头的16位纯数字
    ALIPAY_PARTNER = '2088911797887014'

    # 签约支付宝账号或卖家支付宝帐户
    ALIPAY_SELLER_EMAIL = 'jk@jkbrother3d.com'

    ALIPAY_SIGN_TYPE = 'MD5'

    # 付完款后跳转的页面（同步通知） 要用 http://格式的完整路径，不允许加?id=123这类自定义参数
    ALIPAY_RETURN_URL = 'http://www.3dilove.com/payment/ali_return_url'

    # 交易过程中服务器异步通知的页面 要用 http://格式的完整路径，不允许加?id=123这类自定义参数
    ALIPAY_NOTIFY_URL = 'http://www.3dilove.com/payment/ali_notify_url'

    ALIPAY_SHOW_URL = ''

    # 访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
    ALIPAY_TRANSPORT = 'https'





	# 安全检验码，以数字和字母组成的32位字符
    TENPAY_KEY = 'cf65db7056956d9fd4ace820bc29e9c2'

    TENPAY_INPUT_CHARSET = 'utf-8'

    TENPAY_SIGN_TYPE = 'MD5'

    # 付完款后跳转的页面（同步通知） 要用 http://格式的完整路径，不允许加?id=123这类自定义参数
    TENPAY_RETURN_URL = 'http://www.3dilove.com/payment/ten_return_url'

    # 交易过程中服务器异步通知的页面 要用 http://格式的完整路径，不允许加?id=123这类自定义参数
    TENPAY_NOTIFY_URL = 'http://www.3dilove.com/payment/ten_notify_url'

    # configuration for tenpay
    TENPAY_PARTNER = "1246801401"
